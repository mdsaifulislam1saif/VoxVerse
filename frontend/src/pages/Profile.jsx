import React, { useState } from 'react';
import { useAuth } from '@context/AuthContext';
import { User, Mail, Calendar, Settings, Edit3, Save, X } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    full_name: user?.full_name || '',
    email: user?.email || ''
  });

  const handleSave = () => {
    // TODO: Implement profile update API call
    console.log('Saving profile:', editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      full_name: user?.full_name || '',
      email: user?.email || ''
    });
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8">
          <div className="flex items-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mr-6">
              <User className="h-10 w-10 text-blue-600" />
            </div>
            <div className="text-white">
              <h1 className="text-3xl font-bold">{user?.full_name || user?.username}</h1>
              <p className="text-blue-100 mt-1">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Profile Information</h2>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Edit Profile
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="h-4 w-4 inline mr-2" />
                Username
              </label>
              <input
                type="text"
                value={user?.username || ''}
                disabled
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
              />
              <p className="text-xs text-gray-500 mt-1">Username cannot be changed</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="h-4 w-4 inline mr-2" />
                Full Name
              </label>
              <input
                type="text"
                value={isEditing ? editData.full_name : (user?.full_name || 'Not provided')}
                onChange={(e) => isEditing && setEditData({...editData, full_name: e.target.value})}
                disabled={!isEditing}
                className={`w-full px-4 py-3 border border-gray-300 rounded-lg ${
                  isEditing ? 'focus:outline-none focus:ring-2 focus:ring-blue-500' : 'bg-gray-50 text-gray-600'
                }`}
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="h-4 w-4 inline mr-2" />
                Email Address
              </label>
              <input
                type="email"
                value={isEditing ? editData.email : (user?.email || 'Not provided')}
                onChange={(e) => isEditing && setEditData({...editData, email: e.target.value})}
                disabled={!isEditing}
                className={`w-full px-4 py-3 border border-gray-300 rounded-lg ${
                  isEditing ? 'focus:outline-none focus:ring-2 focus:ring-blue-500' : 'bg-gray-50 text-gray-600'
                }`}
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="h-4 w-4 inline mr-2" />
                Member Since
              </label>
              <input
                type="text"
                value={user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
                disabled
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
              />
            </div>
          </div>
        </div>

        {/* Account Settings */}
        <div className="border-t border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            Account Settings
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-800">Change Password</h4>
                <p className="text-sm text-gray-600">Update your account password</p>
              </div>
              <button className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                Change
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-800">Two-Factor Authentication</h4>
                <p className="text-sm text-gray-600">Add an extra layer of security</p>
              </div>
              <button className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                Enable
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
              <div>
                <h4 className="font-medium text-red-800">Delete Account</h4>
                <p className="text-sm text-red-600">Permanently delete your account and all data</p>
              </div>
              <button className="px-4 py-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;