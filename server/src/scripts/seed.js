import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from '../config/database.js';
import User from '../models/user.model.js';
import Donor from '../models/donor.model.js';
import Request from '../models/request.model.js';
import Thread from '../models/thread.model.js';
import Message from '../models/message.model.js';

dotenv.config();

const seed = async () => {
  await connectDB();

  try {
    // Helper to create a user with hashing via save() if not exists
    const ensureUser = async (user) => {
      const existing = await User.findOne({ email: user.email }).select('+password');
      if (existing) {
        // Upsert missing fields without overriding existing data
        let changed = false;
        const fields = ['phoneNumber', 'gender', 'age'];
        for (const f of fields) {
          const hasValue = existing[f] !== undefined && existing[f] !== null && existing[f] !== '';
          if (!hasValue && user[f] !== undefined && user[f] !== null) {
            existing[f] = user[f];
            changed = true;
          }
        }
        // Addresses: set if none
        if ((!Array.isArray(existing.addresses) || existing.addresses.length === 0) && Array.isArray(user.addresses) && user.addresses.length > 0) {
          existing.addresses = user.addresses;
          changed = true;
        }
        // Name: prefer incoming if different (keep email as identity)
        if (user.name && existing.name !== user.name) {
          existing.name = user.name;
          changed = true;
        }
        if (changed) await existing.save();
        return existing;
      }
      const doc = new User(user);
      await doc.save();
      return doc;
    };

    const usersData = [
      {
        name: 'Ahmed Hassan',
        email: 'ahmed.hassan@example.com',
        password: 'Password123!',
        phoneNumber: '9990011223',
        gender: 'male',
        age: 28,
        addresses: [
          {
            line1: 'Esplanade',
            city: 'Kolkata',
            state: 'West Bengal',
            pincode: '700001',
            country: 'India'
          }
        ]
      },
      {
        name: 'Sarah Johnson',
        email: 'sarah.johnson@example.com',
        password: 'Password123!',
        phoneNumber: '9990011224',
        gender: 'female',
        age: 32,
        addresses: [
          {
            line1: 'Sector 1, Salt Lake',
            city: 'Salt Lake, Kolkata',
            state: 'West Bengal',
            pincode: '700091',
            country: 'India'
          }
        ]
      },
      {
        name: 'Michael Chen',
        email: 'michael.chen@example.com',
        password: 'Password123!',
        phoneNumber: '9990011225',
        gender: 'male',
        age: 35,
        addresses: [
          {
            line1: 'Howrah Maidan',
            city: 'Howrah',
            state: 'West Bengal',
            pincode: '711101',
            country: 'India'
          }
        ]
      },
      {
        name: 'Fatima Al-Zahra',
        email: 'fatima.alzahra@example.com',
        password: 'Password123!',
        phoneNumber: '9990011226',
        gender: 'female',
        age: 26,
        addresses: [
          {
            line1: 'Station Road',
            city: 'Berhampore',
            state: 'West Bengal',
            pincode: '742101',
            country: 'India'
          }
        ]
      },
      {
        name: 'Omar Mahmoud',
        email: 'omar.mahmoud@example.com',
        password: 'Password123!',
        phoneNumber: '9990011227',
        gender: 'male',
        age: 29,
        addresses: [
          {
            line1: 'Bhangar Bazaar',
            city: 'Bhangar',
            state: 'West Bengal',
            pincode: '743502',
            country: 'India'
          }
        ]
      },
      {
        name: 'Layla Ibrahim',
        email: 'layla.ibrahim@example.com',
        password: 'Password123!',
        phoneNumber: '9990011228',
        gender: 'female',
        age: 24,
        addresses: [
          {
            line1: 'Canning Town',
            city: 'Canning',
            state: 'West Bengal',
            pincode: '743329',
            country: 'India'
          }
        ]
      },
      {
        name: 'Youssef Nader',
        email: 'youssef.nader@example.com',
        password: 'Password123!',
        phoneNumber: '9990011229',
        gender: 'male',
        age: 31,
        addresses: [
          {
            line1: 'City Centre',
            city: 'Durgapur',
            state: 'West Bengal',
            pincode: '713201',
            country: 'India'
          }
        ]
      },
      {
        name: 'Nour Hassan',
        email: 'nour.hassan@example.com',
        password: 'Password123!',
        phoneNumber: '9990011230',
        gender: 'female',
        age: 27,
        addresses: [
          {
            line1: 'RN Tagore Road',
            city: 'Krishnanagar',
            state: 'West Bengal',
            pincode: '741101',
            country: 'India'
          }
        ]
      },
      {
        name: 'Karim Farouk',
        email: 'karim.farouk@example.com',
        password: 'Password123!',
        phoneNumber: '9990011231',
        gender: 'male',
        age: 33,
        addresses: [
          {
            line1: 'New Market',
            city: 'Jangipur',
            state: 'West Bengal',
            pincode: '742213',
            country: 'India'
          }
        ]
      },
      {
        name: 'Mona Saleh',
        email: 'mona.saleh@example.com',
        password: 'Password123!',
        phoneNumber: '9990011232',
        gender: 'female',
        age: 30,
        addresses: [
          {
            line1: 'NH-19, Burnpur',
            city: 'Asansol',
            state: 'West Bengal',
            pincode: '713325',
            country: 'India'
          }
        ]
      }
    ];

    const [ahmed, sarah, michael, fatima, omar, layla, youssef, nour, karim, mona] = await Promise.all(usersData.map(ensureUser));

    // Donors linked to users with comprehensive donation histories
    const donorSeeds = [
      {
        userId: ahmed._id,
        bloodType: 'O-',
        availability: 'available',
        location: { type: 'Point', coordinates: [88.3639, 22.5726] }, // Kolkata [lng, lat]
        lastDonationDate: new Date('2024-10-15'),
        donationHistory: [
          { date: new Date('2024-10-15'), hospital: 'NRS Medical College and Hospital', units: 1 },
          { date: new Date('2024-07-20'), hospital: 'SSKM Hospital', units: 1 },
          { date: new Date('2024-04-12'), hospital: 'Apollo Gleneagles Hospital', units: 2 },
          { date: new Date('2024-01-08'), hospital: 'IPGMER & SSKM Hospital', units: 1 }
        ]
      },
      {
        userId: sarah._id,
        bloodType: 'A+',
        availability: 'available',
        location: { type: 'Point', coordinates: [88.4173, 22.5867] }, // Salt Lake (Bidhannagar)
        lastDonationDate: new Date('2024-11-20'),
        donationHistory: [
          { date: new Date('2024-11-20'), hospital: 'AMRI Hospitals, Salt Lake', units: 1 },
          { date: new Date('2024-08-15'), hospital: 'Columbia Asia Hospital, Salt Lake', units: 1 },
          { date: new Date('2024-05-10'), hospital: 'ILS Hospital, Salt Lake', units: 1 }
        ]
      },
      {
        userId: fatima._id,
        bloodType: 'B+',
        availability: 'available',
        location: { type: 'Point', coordinates: [88.2516, 24.1048] }, // Berhampore
        lastDonationDate: new Date('2024-12-01'),
        donationHistory: [
          { date: new Date('2024-12-01'), hospital: 'Murshidabad Medical College and Hospital', units: 1 },
          { date: new Date('2024-09-18'), hospital: 'Berhampore District Hospital', units: 1 },
          { date: new Date('2024-06-25'), hospital: 'Murshidabad Medical College and Hospital', units: 2 },
          { date: new Date('2024-03-14'), hospital: 'Berhampore District Hospital', units: 1 },
          { date: new Date('2023-12-20'), hospital: 'Murshidabad Medical College and Hospital', units: 1 }
        ]
      },
      {
        userId: omar._id,
        bloodType: 'AB+',
        availability: 'available',
        location: { type: 'Point', coordinates: [88.57, 22.41] }, // Bhangar
        lastDonationDate: new Date('2024-11-10'),
        donationHistory: [
          { date: new Date('2024-11-10'), hospital: 'Bhangar Rural Hospital', units: 1 },
          { date: new Date('2024-08-22'), hospital: 'NRS Medical College and Hospital', units: 1 },
          { date: new Date('2024-05-30'), hospital: 'SSKM Hospital', units: 1 }
        ]
      },
      {
        userId: layla._id,
        bloodType: 'O+',
        availability: 'available',
        location: { type: 'Point', coordinates: [88.6666, 22.3384] }, // Canning
        lastDonationDate: new Date('2024-12-10'),
        donationHistory: [
          { date: new Date('2024-12-10'), hospital: 'Canning Sub-Divisional Hospital', units: 1 },
          { date: new Date('2024-09-05'), hospital: 'NRS Medical College and Hospital', units: 1 },
          { date: new Date('2024-06-18'), hospital: 'SSKM Hospital', units: 2 },
          { date: new Date('2024-03-22'), hospital: 'Canning Sub-Divisional Hospital', units: 1 }
        ]
      },
      {
        userId: youssef._id,
        bloodType: 'A-',
        availability: 'available',
        location: { type: 'Point', coordinates: [87.3119, 23.5204] }, // Durgapur
        lastDonationDate: new Date('2024-11-25'),
        donationHistory: [
          { date: new Date('2024-11-25'), hospital: 'Durgapur Steel Plant Hospital', units: 1 },
          { date: new Date('2024-08-30'), hospital: 'The Mission Hospital, Durgapur', units: 1 },
          { date: new Date('2024-05-15'), hospital: 'Durgapur Sub-Divisional Hospital', units: 1 },
          { date: new Date('2024-02-10'), hospital: 'Durgapur Steel Plant Hospital', units: 2 }
        ]
      },
      {
        userId: nour._id,
        bloodType: 'B-',
        availability: 'available',
        location: { type: 'Point', coordinates: [88.5010, 23.4010] }, // Krishnanagar
        lastDonationDate: new Date('2024-12-05'),
        donationHistory: [
          { date: new Date('2024-12-05'), hospital: 'Krishnanagar District Hospital', units: 1 },
          { date: new Date('2024-09-12'), hospital: 'Krishnanagar Sadar Hospital', units: 1 },
          { date: new Date('2024-06-08'), hospital: 'Krishnanagar District Hospital', units: 1 }
        ]
      },
      {
        userId: karim._id,
        bloodType: 'AB-',
        availability: 'available',
        location: { type: 'Point', coordinates: [88.0270, 24.4690] }, // Jangipur
        lastDonationDate: new Date('2024-10-28'),
        donationHistory: [
          { date: new Date('2024-10-28'), hospital: 'Jangipur Sub-Divisional Hospital', units: 1 },
          { date: new Date('2024-07-15'), hospital: 'Murshidabad Medical College and Hospital', units: 1 },
          { date: new Date('2024-04-20'), hospital: 'Jangipur Sub-Divisional Hospital', units: 2 },
          { date: new Date('2024-01-25'), hospital: 'Murshidabad Medical College and Hospital', units: 1 },
          { date: new Date('2023-10-30'), hospital: 'Jangipur Sub-Divisional Hospital', units: 1 }
        ]
      },
      {
        userId: mona._id,
        bloodType: 'O+',
        availability: 'available',
        location: { type: 'Point', coordinates: [86.9830, 23.6850] }, // Asansol
        lastDonationDate: new Date('2024-11-15'),
        donationHistory: [
          { date: new Date('2024-11-15'), hospital: 'Asansol District Hospital', units: 1 },
          { date: new Date('2024-08-10'), hospital: 'Bardhaman Medical College and Hospital', units: 1 },
          { date: new Date('2024-05-25'), hospital: 'Asansol District Hospital', units: 1 },
          { date: new Date('2024-02-18'), hospital: 'The Mission Hospital, Durgapur', units: 2 }
        ]
      }
    ];

    for (const donor of donorSeeds) {
      const exists = await Donor.findOne({ userId: donor.userId });
      if (!exists) {
        await Donor.create(donor);
      }
    }

    // Blood requests
    const requestSeeds = [
      {
        requesterId: michael._id,
        bloodType: 'A+',
        urgency: 'high',
        units: 3,
        hospital: 'Howrah District Hospital',
        location: { type: 'Point', coordinates: [88.2636, 22.5950] },
        notes: 'Urgent surgery patient needs A+ blood',
        status: 'open'
      },
      {
        requesterId: ahmed._id,
        bloodType: 'O-',
        urgency: 'medium',
        units: 2,
        hospital: 'NRS Medical College and Hospital',
        location: { type: 'Point', coordinates: [88.3639, 22.5726] },
        notes: 'Patient with chronic condition needs O- blood',
        status: 'open'
      },
      {
        requesterId: fatima._id,
        bloodType: 'B+',
        urgency: 'high',
        units: 4,
        hospital: 'Murshidabad Medical College and Hospital',
        location: { type: 'Point', coordinates: [88.2516, 24.1048] },
        notes: 'Emergency trauma case requires B+ blood immediately',
        status: 'open'
      },
      {
        requesterId: omar._id,
        bloodType: 'AB+',
        urgency: 'low',
        units: 1,
        hospital: 'Bhangar Rural Hospital',
        location: { type: 'Point', coordinates: [88.57, 22.41] },
        notes: 'Scheduled surgery patient needs AB+ blood',
        status: 'open'
      },
      {
        requesterId: layla._id,
        bloodType: 'O+',
        urgency: 'medium',
        units: 2,
        hospital: 'Canning Sub-Divisional Hospital',
        location: { type: 'Point', coordinates: [88.6666, 22.3384] },
        notes: 'Cancer patient undergoing treatment needs O+ blood',
        status: 'open'
      },
      {
        requesterId: youssef._id,
        bloodType: 'A-',
        urgency: 'high',
        units: 3,
        hospital: 'Durgapur Steel Plant Hospital',
        location: { type: 'Point', coordinates: [87.3119, 23.5204] },
        notes: 'Critical patient in ICU needs A- blood urgently',
        status: 'open'
      },
      {
        requesterId: nour._id,
        bloodType: 'B-',
        urgency: 'medium',
        units: 2,
        hospital: 'Krishnanagar District Hospital',
        location: { type: 'Point', coordinates: [88.5010, 23.4010] },
        notes: 'Pregnant woman with complications needs B- blood',
        status: 'open'
      },
      {
        requesterId: karim._id,
        bloodType: 'AB-',
        urgency: 'low',
        units: 1,
        hospital: 'Jangipur Sub-Divisional Hospital',
        location: { type: 'Point', coordinates: [88.0270, 24.4690] },
        notes: 'Elective surgery patient requires AB- blood',
        status: 'open'
      },
      {
        requesterId: mona._id,
        bloodType: 'O+',
        urgency: 'high',
        units: 5,
        hospital: 'Asansol District Hospital',
        location: { type: 'Point', coordinates: [86.9830, 23.6850] },
        notes: 'Multiple accident victims need O+ blood donations',
        status: 'open'
      },
      {
        requesterId: sarah._id,
        bloodType: 'A+',
        urgency: 'medium',
        units: 2,
        hospital: 'AMRI Hospitals, Salt Lake',
        location: { type: 'Point', coordinates: [88.4173, 22.5867] },
        notes: 'Elderly patient with heart condition needs A+ blood',
        status: 'open'
      }
    ];

    const requests = [];
     for (const requestSeed of requestSeeds) {
       const existingRequest = await Request.findOne({ requesterId: requestSeed.requesterId, hospital: requestSeed.hospital, status: 'open' });
       const request = existingRequest || await Request.create(requestSeed);
       requests.push(request);
     }
     const request = requests[0]; // Use first request for thread creation

    // Thread and messages between Ahmed and Michael
    let thread = await Thread.findOne({ requestId: request._id });
    if (!thread) {
      thread = await Thread.create({ requestId: request._id, participants: [ahmed._id, michael._id] });
    }

    const messagesSeed = [
      { threadId: thread._id, senderId: ahmed._id, content: 'Hi Michael, I can donate O- today. Where should we meet?' },
      { threadId: thread._id, senderId: michael._id, content: 'Thanks Ahmed! Let’s meet at Giza General Hospital at 3 PM.' }
    ];

    for (const msg of messagesSeed) {
      const exists = await Message.findOne({ threadId: msg.threadId, senderId: msg.senderId, content: msg.content });
      if (!exists) {
        await Message.create(msg);
      }
    }

    const counts = {
      users: await User.countDocuments(),
      donors: await Donor.countDocuments(),
      requests: await Request.countDocuments(),
      threads: await Thread.countDocuments(),
      messages: await Message.countDocuments()
    };

    console.log('Seed complete:', counts);
  } catch (err) {
    console.error('Seeding error:', err.message);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

seed();