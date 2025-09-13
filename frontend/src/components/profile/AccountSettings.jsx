import React from 'react';
import { Settings } from 'lucide-react';

const AccountSettings = () => (
  <div className="border-t border-gray-200 p-6">
    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
      <Settings className="h-5 w-5 mr-2" />
      Account Settings
    </h3>
    
    <div className="space-y-4">
      <ActionCard title="Change Password" description="Update your account password" color="blue" actionText="Change" />
      <ActionCard title="Two-Factor Authentication" description="Add an extra layer of security" color="blue" actionText="Enable" />
      <ActionCard title="Delete Account" description="Permanently delete your account and all data" color="red" actionText="Delete" />
    </div>
  </div>
);

const ActionCard = ({ title, description, color, actionText }) => {
  const isRed = color === 'red';
  return (
    <div className={`flex items-center justify-between p-4 rounded-lg ${isRed ? 'bg-red-50 border border-red-200' : 'bg-gray-50'}`}>
      <div>
        <h4 className={`font-medium ${isRed ? 'text-red-800' : 'text-gray-800'}`}>{title}</h4>
        <p className={`text-sm ${isRed ? 'text-red-600' : 'text-gray-600'}`}>{description}</p>
      </div>
      <button className={`px-4 py-2 ${isRed ? 'text-red-600 hover:bg-red-100' : 'text-blue-600 hover:bg-blue-50'} rounded-lg transition-colors`}>
        {actionText}
      </button>
    </div>
  );
};

export default AccountSettings;
