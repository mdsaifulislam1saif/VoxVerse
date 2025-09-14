const Footer = () => {
  return (
    // Footer wrapper with white background and inner shadow
    <footer className="bg-white shadow-inner mt-auto">
      {/* Container to center content and add responsive padding */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Text content, centered and styled */}
        <div className="text-center text-gray-600">
          <p>&copy; 2024 Saif. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
