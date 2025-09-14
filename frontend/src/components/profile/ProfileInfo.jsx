import { User, Mail, Calendar } from 'lucide-react';

const ProfileInfo = ({ user }) => (
  <div className="p-6">
    {/* Section Title */}
    <h2 className="text-xl font-bold text-gray-800 mb-6">Profile Information</h2>
    {/* Grid layout for profile fields */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Username */}
      <InputField
        icon={<User className="h-4 w-4 inline mr-2" />}
        label="Username"
        value={user?.username || ''}
      />
      {/* Full Name */}
      <InputField
        icon={<User className="h-4 w-4 inline mr-2" />}
        label="Full Name"
        value={user?.full_name || 'Not provided'}
      />
      {/* Email Address */}
      <InputField
        icon={<Mail className="h-4 w-4 inline mr-2" />}
        label="Email Address"
        value={user?.email || 'Not provided'}
      />
      {/* Account Creation Date */}
      <InputField
        icon={<Calendar className="h-4 w-4 inline mr-2" />}
        label="Member Since"
        value={user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
      />
    </div>
  </div>
);

const InputField = ({ icon, label, value }) => (
  <div>
    {/* Field Label */}
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {icon} {label}
    </label>
    {/* Read-only input displaying value */}
    <input
      type="text"
      value={value}
      disabled
      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
    />
  </div>
);
export default ProfileInfo;
