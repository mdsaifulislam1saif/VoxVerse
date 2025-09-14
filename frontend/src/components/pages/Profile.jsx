import { useAuth } from '../../context/AuthContext';
import AccountSettings from '../profile/AccountSettings';
import ProfileHeader from '../profile/ProfileHeader';
import ProfileInfo from '../profile/ProfileInfo';

const Profile = () => {
  // Get the authenticated user's information from context
  const { user } = useAuth();
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Container for profile sections */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header: User avatar, name, and basic info */}
        <ProfileHeader user={user} />
        {/* Detailed Info: Email, username, and other profile details */}
        <ProfileInfo user={user} />
        {/* Account Settings: Options for updating password, preferences, etc. */}
        <AccountSettings />
      </div>
    </div>
  );
};
export default Profile;
