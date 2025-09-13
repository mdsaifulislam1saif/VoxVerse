import { useAuth } from '../../context/AuthContext';
import AccountSettings from '../profile/AccountSettings';
import ProfileHeader from '../profile/ProfileHeader';
import ProfileInfo from '../profile/ProfileInfo';

const Profile = () => {
  const { user } = useAuth();
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <ProfileHeader user={user} />
        <ProfileInfo user={user} />
        <AccountSettings />
      </div>
    </div>
  );
};
export default Profile;
