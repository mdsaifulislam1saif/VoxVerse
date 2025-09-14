import { useAuth } from '../../context/AuthContext';
import HeroSection from '../home/HeroSection';
import FeaturesSection from '../home/FeaturesSection';
import HowItWorks from '../home/HowItWorks';
import CTASection from '../home/CTASection';

const Home = () => {
  const { isAuthenticated } = useAuth();
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <HeroSection isAuthenticated={isAuthenticated} />
      <FeaturesSection />
      <HowItWorks />
      {/* Shown only to users who are not logged in */}
      {!isAuthenticated && <CTASection />}
    </div>
  );
};
export default Home;
