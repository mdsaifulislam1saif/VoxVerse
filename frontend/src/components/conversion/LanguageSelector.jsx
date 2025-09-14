import { LANGUAGES } from "../../config/config";

const LanguageSelector = ({ selectedLanguage, setSelectedLanguage }) => {
  return (
    <div className="w-full">
      {/* Label for accessibility + UI context */}
      <label
        htmlFor="language"
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        Language
      </label>
      {/* Dropdown menu for language selection */}
      <select
        id="language"
        value={selectedLanguage}
        onChange={(e) => setSelectedLanguage(e.target.value)} // update state when changed
        className="w-full h-12 px-4 border border-gray-300 rounded-lg text-gray-700 
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        {/* Render all available languages from config */}
        {LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {/* Show country flag emoji + language name */}
            {lang.flag} {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
};
export default LanguageSelector;
