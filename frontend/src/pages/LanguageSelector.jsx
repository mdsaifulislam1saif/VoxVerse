import React from 'react';
import { LANGUAGES } from '@utils/constants';

const LanguageSelector = ({ selectedLanguage, setSelectedLanguage }) => {
  return (
    <div className="w-full">
      <label
        htmlFor="language"
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        Language
      </label>
      <select
        id="language"
        value={selectedLanguage}
        onChange={(e) => setSelectedLanguage(e.target.value)}
        className="w-full h-12 px-4 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        {LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;
