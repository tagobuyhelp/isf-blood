'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Edit, Heart, Calendar, MapPin, Phone, Mail, Award } from 'lucide-react';
import api from '@/lib/api';
import { loadSession, isSessionValid, maskToken } from '@/lib/userStore';

function sanitizeName(v) {
  return String(v || '').trim().replace(/[<>]/g, '');
}
function sanitizeEmail(v) {
  return String(v || '').trim();
}
function sanitizePhone(v) {
  return String(v || '').trim().replace(/[^\d+\-()\s]/g, '');
}
function isValidEmail(v) {
  return /^\S+@\S+\.\S+$/.test(String(v || '').trim());
}
function isValidPhone(v) {
  const d = String(v || '').replace(/\D/g, '');
  return d.length >= 10;
}

function getBloodGroupColor(bloodGroup) {
  const colors = {
    'A+': 'from-red-400 to-red-600',
    'A-': 'from-red-400 to-red-600',
    'B+': 'from-blue-400 to-blue-600',
    'B-': 'from-blue-400 to-blue-600',
    'AB+': 'from-purple-400 to-purple-600',
    'AB-': 'from-purple-400 to-purple-600',
    'O+': 'from-green-400 to-green-600',
    'O-': 'from-orange-400 to-orange-600',
  };
  return colors[bloodGroup] || 'from-gray-400 to-gray-600';
}

export default function ProfilePage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');
  const [user, setUser] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', phone: '' });
  const [addresses, setAddresses] = useState([]);
  const [addressForm, setAddressForm] = useState({ line1: '', city: '', state: '', pincode: '', country: 'India', is_default: false, address_type: 'shipping' });

  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarError, setAvatarError] = useState('');
  const [pwdForm, setPwdForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [donations, setDonations] = useState([]);
  const [donationsLoading, setDonationsLoading] = useState(false);
  const [donationsError, setDonationsError] = useState('');
  const [donationForm, setDonationForm] = useState({ date: '', hospital: '', units: 1 });

  useEffect(() => {
    let mounted = true;
    async function init() {
      setLoading(true);
      setError(null);
      let fetchedMe = false;
      try {
        const session = await loadSession();
        const valid = await isSessionValid();
        if (!mounted) return;
        if (session?.user) {
          const u = session.user;
          setUser(u);
          setEditForm({ name: u?.name || '', email: u?.email || '', phone: u?.phone || u?.phoneNumber || '' });
          setAddresses(u?.addresses || []);
        } else {
          const res = await api.me();
          const u = res?.data || res;
          fetchedMe = true;
          if (!mounted) return;
          setUser(u);
          setEditForm({ name: u?.name || '', email: u?.email || '', phone: u?.phone || u?.phoneNumber || '' });
          setAddresses(u?.addresses || []);
        }
        // Only show expiry message if local session is invalid
        // AND we did not just fetch user via /auth/me successfully (cookie-based auth)
        if (!valid && !fetchedMe) {
          router.replace('/login');
        }
      } catch (e) {
        setError(e?.data?.message || e?.message || 'Failed to initialize profile');
        if (e?.code === 'AUTH_REQUIRED' || e?.status === 401) {
          router.replace('/login');
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }
    init();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    let mounted = true;
    async function fetchDonations() {
      if (!user) return;
      setDonationsLoading(true);
      setDonationsError('');
      try {
        const res = await api.listDonations();
        const payload = res?.donations || [];
        if (mounted) setDonations(payload);
      } catch (e) {
        if (mounted) setDonationsError(e?.data?.message || e?.message || 'Failed to load donation history');
      } finally {
        if (mounted) setDonationsLoading(false);
      }
    }
    fetchDonations();
    return () => { mounted = false; };
  }, [user]);

  const initials = useMemo(() => {
    const n = user?.name || editForm.name || '';
    return n.trim().split(' ').filter(Boolean).map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'U';
  }, [user, editForm.name]);

  const joinDate = useMemo(() => {
    const d = user?.created_at || user?.createdAt;
    if (!d) return '';
    try {
      return new Date(d).toLocaleString(undefined, { month: 'long', year: 'numeric' });
    } catch { return ''; }
  }, [user]);

  const bloodGroup = '—';

  async function handleSave() {
    setError(null);
    setSuccess('');
    const payload = {
      name: sanitizeName(editForm.name),
      email: sanitizeEmail(editForm.email),
      phone: sanitizePhone(editForm.phone)
    };

    if (!payload.name) { setError('Name is required'); return; }
    if (!isValidEmail(payload.email)) { setError('Please provide a valid email'); return; }
    if (payload.phone && !isValidPhone(payload.phone)) { setError('Please provide a valid phone number'); return; }

    setSaving(true);
    try {
      const res = await api.updateMe(payload);
      const updated = res?.data || res;
      setUser(updated);
      setEditForm({ name: updated?.name || '', email: updated?.email || '', phone: updated?.phone || updated?.phoneNumber || '' });
      setSuccess('Profile updated successfully');
      setIsEditing(false);
    } catch (e) {
      setError(e?.data?.message || e?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    setError(null);
    setSuccess('');
    setEditForm({ name: user?.name || '', email: user?.email || '', phone: user?.phone || user?.phoneNumber || '' });
    setIsEditing(false);
  }

  async function handleAddAddress() {
    setError(null);
    setSuccess('');
    const payload = {
      line1: String(addressForm.line1 || '').trim(),
      city: String(addressForm.city || '').trim(),
      state: String(addressForm.state || '').trim(),
      pincode: String(addressForm.pincode || '').trim(),
      country: String(addressForm.country || '').trim() || 'India',
      is_default: !!addressForm.is_default,
      address_type: String(addressForm.address_type || 'shipping')
    };
    if (!payload.line1 || !payload.city || !payload.state || !/^\d{6}$/.test(payload.pincode)) {
      setError('Please fill all address fields with a valid 6-digit pincode');
      return;
    }
    try {
      const res = await api.addAddress(payload);
      const u = res?.data || res;
      setAddresses(u?.addresses || []);
      setSuccess('Address added');
      setAddressForm({ line1: '', city: '', state: '', pincode: '', country: 'India', is_default: false, address_type: 'shipping' });
    } catch (e) {
      setError(e?.data?.message || e?.message || 'Failed to add address');
    }
  }

  async function handleDeleteAddress(id) {
    setError(null);
    setSuccess('');
    try {
      const res = await api.deleteAddress(id);
      const u = res?.data || res;
      setAddresses(u?.addresses || []);
      setSuccess('Address deleted');
    } catch (e) {
      setError(e?.data?.message || e?.message || 'Failed to delete address');
    }
  }

  async function handleSetDefaultAddress(addressId) {
    setError(null);
    setSuccess('');
    try {
      const res = await api.setDefaultAddress(addressId);
      const u = res?.data || res;
      setAddresses(u?.addresses || []);
      setSuccess('Default address updated');
    } catch (e) {
      setError(e?.data?.message || e?.message || 'Failed to set default address');
    }
  }

  async function handleUpdatePassword() {
    setError(null);
    setSuccess('');
    const { currentPassword, newPassword, confirmPassword } = pwdForm;
    if (!currentPassword || !newPassword) { setError('Please fill all password fields'); return; }
    if (newPassword.length < 8) { setError('New password must be at least 8 characters'); return; }
    if (newPassword !== confirmPassword) { setError('New password and confirmation do not match'); return; }
    setSaving(true);
    try {
      await api.updatePassword({ currentPassword, newPassword });
      setSuccess('Password updated successfully');
      setPwdForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (e) {
      setError(e?.data?.message || e?.message || 'Failed to update password');
    } finally {
      setSaving(false);
    }
  }

  async function handleAddDonation() {
    setDonationsError('');
    const { date, hospital, units } = donationForm;
    if (!date || !hospital || !units) {
      setDonationsError('Please fill date, hospital, and units');
      return;
    }
    try {
      const res = await api.addDonation({ date, hospital: String(hospital).trim(), units: Number(units) });
      const payload = res?.donations || [];
      setDonations(payload);
      setDonationForm({ date: '', hospital: '', units: 1 });
    } catch (e) {
      setDonationsError(e?.data?.message || e?.message || 'Failed to add donation');
    }
  }

  async function handleAvatarChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarError('');
    setAvatarUploading(true);
    try {
      const res = await api.updateAvatar(file);
      const updated = res?.data || res;
      setUser(updated);
      setSuccess('Avatar updated successfully');
    } catch (err) {
      setAvatarError(err?.data?.message || err?.message || 'Failed to update avatar');
    } finally {
      setAvatarUploading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-4">
            <div className="h-32 bg-gray-200 rounded-isf-lg" />
            <div className="h-24 bg-gray-200 rounded-isf-lg" />
            <div className="h-40 bg-gray-200 rounded-isf-lg" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white rounded-isf-lg shadow-isf overflow-hidden mb-6">
          {/* Cover/Background */}
          <div className={`h-32 bg-gradient-to-r ${getBloodGroupColor(bloodGroup)} relative`}>
            <div className="absolute top-4 right-4">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors duration-200"
              >
                <Edit className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Profile Info */}
          <div className="px-6 pb-6">
            {/* Profile Picture */}
            <div className="relative -mt-16 mb-4">
              {user?.avatar ? (
                <div className="mx-auto w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
                  <Image
                    src={user.avatar}
                    alt="User avatar"
                    width={96}
                    height={96}
                    className="object-cover w-full h-full"
                    priority
                  />
                </div>
              ) : (
                <div className="w-24 h-24 bg-gradient-to-br from-primary to-primary-dark rounded-full border-4 border-white flex items-center justify-center text-white font-bold text-2xl mx-auto shadow-lg">
                  {initials}
                </div>
              )}
              <div className="absolute bottom-2 right-1/2 transform translate-x-12 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
            </div>

            <div className="mt-3 flex items-center justify-center">
              <label className="inline-flex items-center px-3 py-1 text-xs sm:text-sm bg-white border rounded cursor-pointer hover:bg-gray-50">
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                {avatarUploading ? 'Uploading…' : 'Change Avatar'}
              </label>
            </div>
            {avatarError && (
              <p className="mt-2 text-center text-sm text-red-600">{avatarError}</p>
            )}

            {/* Name and Blood Group */}
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">{user?.name || editForm.name}</h1>
              <div className="flex items-center justify-center space-x-2 mb-2">
                <span className={`px-4 py-2 bg-gradient-to-r ${getBloodGroupColor(bloodGroup)} text-white rounded-full font-semibold text-lg`}>
                  {bloodGroup}
                </span>
              </div>
              <p className="text-gray-600">Member since {joinDate}</p>
            </div>

            {/* Session Status */}
            <div className="mb-4">
              <SessionStatus />
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-red-50 rounded-isf p-4 text-center">
                <div className="text-2xl font-bold text-red-600 mb-1">{bloodGroup}</div>
                <div className="text-xs text-gray-600">Blood Type</div>
              </div>
              <div className="bg-blue-50 rounded-isf p-4 text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">{0}</div>
                <div className="text-xs text-gray-600">Donations</div>
              </div>
              <div className="bg-green-50 rounded-isf p-4 text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">{0}</div>
                <div className="text-xs text-gray-600">Lives Impacted</div>
              </div>
            </div>

            {/* Motivational Message */}
            <div className="bg-gradient-to-r from-primary to-primary-dark rounded-isf-lg p-6 text-center text-white mb-6">
              <h3 className="text-lg font-semibold mb-2">One Drop Can Save a Life</h3>
              <p className="text-sm opacity-90 mb-4">
                Keep making a difference—every contribution matters!
              </p>
              <button className="bg-white text-primary px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-200">
                Donate Now
              </button>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-isf-lg shadow-isf p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
          {error && (
            <div className="mb-4 p-3 rounded bg-red-50 text-red-700 border border-red-200">{error}</div>
          )}
          {success && (
            <div className="mb-4 p-3 rounded bg-green-50 text-green-700 border border-green-200">{success}</div>
          )}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-gray-500" />
              <div className="w-full">
                <div className="text-sm text-gray-500">Email</div>
                {isEditing ? (
                  <input
                    type="email"
                    className="mt-1 w-full border rounded px-3 py-2 text-sm"
                    value={editForm.email}
                    onChange={(e) => setEditForm(f => ({ ...f, email: e.target.value }))}
                  />
                ) : (
                  <div className="font-medium break-all">{user?.email}</div>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-gray-500" />
              <div className="w-full">
                <div className="text-sm text-gray-500">Phone</div>
                {isEditing ? (
                  <input
                    type="tel"
                    className="mt-1 w-full border rounded px-3 py-2 text-sm"
                    value={editForm.phone}
                    onChange={(e) => setEditForm(f => ({ ...f, phone: e.target.value }))}
                  />
                ) : (
                  <div className="font-medium">{user?.phone || user?.phoneNumber || '—'}</div>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-gray-500" />
              <div className="w-full">
                <div className="text-sm text-gray-500">Default City</div>
                <div className="font-medium">{addresses?.[0]?.city || '—'}</div>
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            {isEditing ? (
              <>
                <button onClick={handleCancel} className="px-4 py-2 border rounded">Cancel</button>
                <button onClick={handleSave} className="px-4 py-2 bg-primary text-white rounded disabled:opacity-50" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
              </>
            ) : (
              <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-primary text-white rounded">Edit Profile</button>
            )}
          </div>
        </div>

        {/* Addresses */}
        <div className="bg-white rounded-isf-lg shadow-isf p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Addresses</h2>
          <div className="space-y-2">
            {(addresses || []).map(addr => (
              <div key={addr._id || `${addr.line1}-${addr.city}`} className="flex items-start justify-between p-3 bg-gray-50 rounded-isf">
                <div className="text-sm text-gray-700">
                  <div className="font-medium">{addr.line1}</div>
                  <div>{addr.city}, {addr.state} {addr.pincode}</div>
                  <div className="text-xs text-gray-500">{addr.country}</div>
                </div>
                {addr._id && (
                  <div className="flex items-center gap-3">
                    {!addr.is_default && (
                      <button onClick={() => handleSetDefaultAddress(addr._id)} className="text-sm text-primary hover:text-primary-dark">Set default</button>
                    )}
                    <button onClick={() => handleDeleteAddress(addr._id)} className="text-sm text-red-600 hover:text-red-700">Delete</button>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            <input className="border rounded px-3 py-2 text-sm" placeholder="Line 1" value={addressForm.line1} onChange={e => setAddressForm(f => ({ ...f, line1: e.target.value }))} />
            <input className="border rounded px-3 py-2 text-sm" placeholder="City" value={addressForm.city} onChange={e => setAddressForm(f => ({ ...f, city: e.target.value }))} />
            <input className="border rounded px-3 py-2 text-sm" placeholder="State" value={addressForm.state} onChange={e => setAddressForm(f => ({ ...f, state: e.target.value }))} />
            <input className="border rounded px-3 py-2 text-sm" placeholder="Pincode" value={addressForm.pincode} onChange={e => setAddressForm(f => ({ ...f, pincode: e.target.value }))} />
            <input className="border rounded px-3 py-2 text-sm" placeholder="Country" value={addressForm.country} onChange={e => setAddressForm(f => ({ ...f, country: e.target.value }))} />
          </div>
          <div className="mt-2 flex gap-2">
            <label className="text-sm flex items-center gap-2"><input type="checkbox" checked={addressForm.is_default} onChange={e => setAddressForm(f => ({ ...f, is_default: e.target.checked }))} /> Set as default</label>
            <select className="text-sm border rounded px-2 py-1" value={addressForm.address_type} onChange={e => setAddressForm(f => ({ ...f, address_type: e.target.value }))}>
              <option value="shipping">Shipping</option>
              <option value="billing">Billing</option>
            </select>
            <button onClick={handleAddAddress} className="ml-auto bg-primary text-white px-3 py-1 rounded disabled:opacity-50" disabled={saving}>Add Address</button>
          </div>
        </div>

        {/* Security */}
        <div className="bg-white rounded-isf-lg shadow-isf p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Security</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input type="password" placeholder="Current password" className="border rounded px-3 py-2 text-sm" value={pwdForm.currentPassword} onChange={e => setPwdForm(f => ({ ...f, currentPassword: e.target.value }))} />
            <input type="password" placeholder="New password" className="border rounded px-3 py-2 text-sm" value={pwdForm.newPassword} onChange={e => setPwdForm(f => ({ ...f, newPassword: e.target.value }))} />
            <input type="password" placeholder="Confirm new password" className="border rounded px-3 py-2 text-sm sm:col-span-2" value={pwdForm.confirmPassword} onChange={e => setPwdForm(f => ({ ...f, confirmPassword: e.target.value }))} />
          </div>
          <div className="mt-3 flex justify-end">
            <button onClick={handleUpdatePassword} className="px-4 py-2 bg-primary text-white rounded disabled:opacity-50" disabled={saving}>{saving ? 'Updating…' : 'Update Password'}</button>
          </div>
        </div>

        {/* Donation History */}
        <div className="bg-white rounded-isf-lg shadow-isf p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Donation History</h2>
          {donationsLoading ? (
            <div className="text-sm text-gray-600">Loading donation history…</div>
          ) : donationsError ? (
            <div className="text-sm text-red-600">{donationsError}</div>
          ) : donations.length === 0 ? (
            <div className="text-sm text-gray-600">No donations recorded yet.</div>
          ) : (
            <div className="space-y-3">
              {donations.map((d, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-isf">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                      <Heart className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-medium">{d.hospital}</div>
                      <div className="text-sm text-gray-500">{new Date(d.date).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-gray-900">{d.units} unit{Number(d.units) > 1 ? 's' : ''}</div>
                </div>
              ))}
            </div>
          )}

          {/* Add Donation Entry */}
          <div className="mt-4 border-t pt-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Add Donation</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input type="date" className="border rounded px-3 py-2 text-sm" value={donationForm.date} onChange={e => setDonationForm(f => ({ ...f, date: e.target.value }))} />
              <input type="text" placeholder="Hospital" className="border rounded px-3 py-2 text-sm" value={donationForm.hospital} onChange={e => setDonationForm(f => ({ ...f, hospital: e.target.value }))} />
              <input type="number" min="1" max="10" placeholder="Units" className="border rounded px-3 py-2 text-sm" value={donationForm.units} onChange={e => setDonationForm(f => ({ ...f, units: Number(e.target.value) }))} />
            </div>
            <div className="mt-2 flex justify-end">
              <button onClick={handleAddDonation} className="px-4 py-2 bg-primary text-white rounded disabled:opacity-50" disabled={donationsLoading}>Add</button>
            </div>
          </div>
        </div>

        {/* Badges & Achievements */}
        <div className="bg-white rounded-isf-lg shadow-isf p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Badges & Achievements</h2>
          <div className="grid grid-cols-2 gap-4">
            {['First Donor', 'Regular Donor'].map((badge, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-isf">
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                  <Award className="w-4 h-4 text-white" />
                </div>
                <span className="font-medium text-gray-900">{badge}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Next Donation */}
        <div className="bg-white rounded-isf-lg shadow-isf p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Next Donation Eligibility</h2>
          <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-isf">
            <Calendar className="w-8 h-8 text-blue-600" />
            <div>
              <div className="font-medium text-gray-900">We will notify you when you are eligible again</div>
              <div className="text-sm text-gray-600">You can donate blood again after this date</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
function SessionStatus() {
  const [tokenMasked, setTokenMasked] = useState('—');
  const [valid, setValid] = useState(null);
  const [expiresAt, setExpiresAt] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function read() {
      const s = await loadSession();
      if (!mounted) return;
      setTokenMasked(maskToken(s?.token));
      setValid(s ? Date.now() < Number(s.exp || 0) : false);
      setExpiresAt(s?.exp || null);
    }
    read();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="bg-gray-50 rounded-isf p-4 text-center">
        <div className="text-xs text-gray-600">Auth Token</div>
        <div className="text-sm font-mono break-all">{tokenMasked}</div>
      </div>
      <div className="bg-gray-50 rounded-isf p-4 text-center">
        <div className="text-xs text-gray-600">Session Valid</div>
        <div className={`text-sm font-semibold ${valid ? 'text-green-600' : 'text-red-600'}`}>{valid === null ? '—' : valid ? 'Yes' : 'No'}</div>
      </div>
      <div className="bg-gray-50 rounded-isf p-4 text-center">
        <div className="text-xs text-gray-600">Expires</div>
        <div className="text-sm">{expiresAt ? new Date(expiresAt).toLocaleString() : '—'}</div>
      </div>
    </div>
  );
}