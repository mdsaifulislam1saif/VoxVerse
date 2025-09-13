import React from 'react';
import { User } from 'lucide-react';

const ProfileHeader = ({ user }) => (
  <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8">
    <div className="flex items-center">
      <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mr-6">
        <User className="h-10 w-10 text-blue-600" />
      </div>
      <div className="text-white">
        <h1 className="text-3xl font-bold">{user?.username}</h1>
        <p className="text-blue-100 mt-1">{user?.email}</p>
      </div>
    </div>
  </div>
);

export default ProfileHeader;
