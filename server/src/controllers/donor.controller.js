import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';
import Donor from '../models/donor.model.js';
import Request from '../models/request.model.js';
import mongoose from 'mongoose';

function toKm(meters) { return Math.round((meters / 1000) * 10) / 10; }
function haversineDistanceKm(lat1, lon1, lat2, lon2) {
    const toRad = (v) => (v * Math.PI) / 180;
    const R = 6371; // km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 10) / 10;
}

/**
 * @desc    Search donors near a location
 * @route   GET /api/v1/donors/search
 * @access  Public
 */
export const searchDonors = async (req, res, next) => {
    try {
        const { lat, lng, radiusKm = 10, bloodType, availability } = req.query;
        if (lat === undefined || lng === undefined) {
            return next(new ApiError(400, 'lat and lng are required'));
        }
        const latitude = parseFloat(lat);
        const longitude = parseFloat(lng);
        const maxDistanceMeters = Math.min(100 * 1000, Math.max(0.1, Number(radiusKm)) * 1000);

        const query = {
            location: {
                $near: {
                    $geometry: { type: 'Point', coordinates: [longitude, latitude] },
                    $maxDistance: maxDistanceMeters
                }
            }
        };
        if (bloodType) query.bloodType = bloodType;
        if (availability) query.availability = availability;

        const donors = await Donor.find(query)
            .limit(50)
            .populate('userId', 'name email phone phoneNumber addresses avatar gender age');

        const results = donors.map((d) => {
            const [lngD, latD] = d.location.coordinates;
            const distanceKm = haversineDistanceKm(latitude, longitude, latD, lngD);
            const donationCount = Array.isArray(d.donationHistory) ? d.donationHistory.length : 0;
            const lastDonationISO = d.lastDonationDate
                ? new Date(d.lastDonationDate).toISOString().slice(0, 10)
                : (Array.isArray(d.donationHistory) && d.donationHistory.length
                    ? new Date(Math.max(...d.donationHistory.map(e => new Date(e.date).getTime()))).toISOString().slice(0, 10)
                    : null);
            return {
                id: d._id,
                name: d.userId?.name || 'Anonymous',
                bloodGroup: d.bloodType,
                availability: d.availability,
                lastDonation: lastDonationISO,
                verified: true,
                distance: distanceKm,
                gender: d.userId?.gender || undefined,
                age: d.userId?.age || undefined,
                address: d.userId?.addresses?.[0]?.city || undefined,
                phone: d.userId?.phone || d.userId?.phoneNumber || undefined,
                email: d.userId?.email || undefined,
                image: d.userId?.avatar || (d.userId?.gender === 'female' ? '/assets/donor-profile-female.png' : '/assets/donor-profile-male.png'),
                totalDonations: donationCount,
                coords: { lat: latD, lng: lngD }
            };
        });

        // Debug: summarize search results
        console.log('[Donors] searchDonors response', { count: results.length, sample: results[0] ? { id: results[0].id, lastDonation: results[0].lastDonation, totalDonations: results[0].totalDonations } : null });

        res.status(200).json(new ApiResponse(200, { results, page: 1, total: results.length }, 'Donors search'));
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Top donors by blood type
 * @route   GET /api/v1/donors/top
 * @access  Public
 */
export const topDonors = async (req, res, next) => {
    try {
        const { bloodType } = req.query;
        const query = { availability: 'available' };
        if (bloodType) query.bloodType = bloodType;

        const donors = await Donor.find(query)
            .sort({ lastDonationDate: -1, createdAt: -1 })
            .limit(12)
            .populate('userId', 'name email phone phoneNumber addresses avatar gender age');

        const shaped = donors.map((d) => {
            const donationCount = Array.isArray(d.donationHistory) ? d.donationHistory.length : 0;
            const lastDonationISO = d.lastDonationDate
                ? new Date(d.lastDonationDate).toISOString().slice(0, 10)
                : (Array.isArray(d.donationHistory) && d.donationHistory.length
                    ? new Date(Math.max(...d.donationHistory.map(e => new Date(e.date).getTime()))).toISOString().slice(0, 10)
                    : null);
            const hasCoords = Array.isArray(d.location?.coordinates) && d.location.coordinates.length === 2;
            const [lngD, latD] = hasCoords ? d.location.coordinates : [undefined, undefined];
            return {
                id: d._id,
                name: d.userId?.name || 'Anonymous',
                bloodGroup: d.bloodType,
                availability: d.availability,
                lastDonation: lastDonationISO,
                verified: true,
                distance: undefined,
                address: d.userId?.addresses?.[0]?.city || undefined,
                phone: d.userId?.phone || d.userId?.phoneNumber || undefined,
                email: d.userId?.email || undefined,
                gender: d.userId?.gender || undefined,
                age: d.userId?.age || undefined,
                image: d.userId?.avatar || (d.userId?.gender === 'female' ? '/assets/donor-profile-female.png' : '/assets/donor-profile-male.png'),
                totalDonations: donationCount,
                coords: hasCoords ? { lat: latD, lng: lngD } : undefined
            };
        });

        // Debug: summarize top donors
        console.log('[Donors] topDonors response', { count: shaped.length, sample: shaped[0] ? { id: shaped[0].id, lastDonation: shaped[0].lastDonation, totalDonations: shaped[0].totalDonations } : null });

        res.status(200).json(new ApiResponse(200, { donors: shaped }, 'Top donors'));
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get donor details by id (including donation history)
 * @route   GET /api/v1/donors/:id
 * @access  Public
 */
export const getDonorById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { lat, lng, radiusKm = 25 } = req.query; // optional for distance & nearby requests
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(new ApiError(400, 'Invalid donor id'));
        }

        const donor = await Donor.findById(id)
            .populate('userId', 'name email phone phoneNumber addresses avatar gender age');

        if (!donor) {
            return next(new ApiError(404, 'Donor not found'));
        }

        const donationHistory = (donor.donationHistory || []).map((d) => ({
            date: new Date(d.date).toISOString().slice(0, 10),
            hospital: d.hospital,
            units: d.units
        }));

        const lastDonationISO = donor.lastDonationDate
            ? new Date(donor.lastDonationDate).toISOString().slice(0, 10)
            : (donationHistory.length
                ? donationHistory[0].date
                : null);

        // Optional distance from provided lat/lng
        let distance = undefined;
        if (lat !== undefined && lng !== undefined && donor?.location?.coordinates?.length === 2) {
            const latitude = parseFloat(lat);
            const longitude = parseFloat(lng);
            const [lngD, latD] = donor.location.coordinates;
            distance = haversineDistanceKm(latitude, longitude, latD, lngD);
        }

        // Nearby open requests count for this blood type within given radius
        let requestCount = undefined;
        try {
            const radiusKmNum = Math.min(100, Math.max(0.1, Number(radiusKm)));
            if (donor?.location?.coordinates?.length === 2) {
                const [lngD, latD] = donor.location.coordinates;
                const earthRadiusKm = 6378.1;
                const radiusRadians = radiusKmNum / earthRadiusKm;
                requestCount = await Request.countDocuments({
                    bloodType: donor.bloodType,
                    status: 'open',
                    location: {
                        $geoWithin: { $centerSphere: [[lngD, latD], radiusRadians] }
                    }
                });
            }
        } catch (e) {
            requestCount = undefined; // fail-safe
        }

        const shaped = {
            id: donor._id,
            name: donor.userId?.name || 'Anonymous',
            bloodGroup: donor.bloodType,
            availability: donor.availability,
            lastDonation: lastDonationISO,
            verified: true,
            address: donor.userId?.addresses?.[0]?.city || undefined,
            phone: donor.userId?.phone || donor.userId?.phoneNumber || undefined,
            email: donor.userId?.email || undefined,
            gender: donor.userId?.gender || undefined,
            age: donor.userId?.age || undefined,
            image: donor.userId?.avatar || (donor.userId?.gender === 'female' ? '/assets/donor-profile-female.png' : '/assets/donor-profile-male.png'),
            donationHistory,
            totalDonations: donationHistory.length,
            distance,
            requestCount,
            // Added: full user profile snapshot alongside shaped fields
            user: {
                id: donor.userId?._id,
                name: donor.userId?.name,
                email: donor.userId?.email,
                phone: donor.userId?.phone || donor.userId?.phoneNumber,
                gender: donor.userId?.gender,
                age: donor.userId?.age,
                avatar: donor.userId?.avatar,
                addresses: donor.userId?.addresses || []
            },
            // Added: raw donor fields that may be useful to clients/admins
            raw: {
                bloodType: donor.bloodType,
                availability: donor.availability,
                location: donor.location,
                lastDonationDate: donor.lastDonationDate || null,
                createdAt: donor.createdAt,
                updatedAt: donor.updatedAt
            }
        };

        // Debug: log response payload for donor details
        console.log('[Donors] getDonorById response', {
            id,
            donor: {
                id: shaped.id,
                name: shaped.name,
                bloodGroup: shaped.bloodGroup,
                lastDonation: shaped.lastDonation,
                donationsCount: shaped.totalDonations
            }
        });

        res.status(200).json(new ApiResponse(200, { donor: shaped }, 'Donor details'));
    } catch (error) {
        next(error);
    }
};