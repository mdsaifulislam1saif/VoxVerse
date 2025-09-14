import features from "./featuresData";

const FeaturesSection = () => {
  return (
    <div className="mb-16">
      {/* Section heading */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Powerful Features
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Everything you need to convert text to audio efficiently and effectively.
        </p>
      </div>
      {/* Features grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow-lg 
                       hover:shadow-xl transition-all duration-300 
                       transform hover:-translate-y-2"
          >
            {/* Feature icon */}
            <div className="mb-4">{feature.icon}</div>
            {/* Feature title */}
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              {feature.title}
            </h3>
            {/* Feature description */}
            <p className="text-gray-600 leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
export default FeaturesSection;
