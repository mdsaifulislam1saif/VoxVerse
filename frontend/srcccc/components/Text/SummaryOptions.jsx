const languages = [ 
    { code : 'en', name: 'English', flag: '🇺🇸' },
    { code : 'fr', name: 'French', flag: '🇫🇷' },
    { code : 'de', name: 'German', flag: '🇩🇪' },
    { code : 'es', name: 'Spanish', flag: '🇪🇸' },
    { code : 'it', name: 'Italian', flag: '🇮🇹' },
    { code : 'nl', name: 'Dutch', flag: '🇳🇱' },
    { code : 'pt', name: 'Portuguese', flag: '🇵🇹' },
    { code : 'pl', name: 'Polish', flag: '🇵🇱' },
    { code : 'tr', name: 'Turkish', flag: '🇹🇷' },
    { code : 'ja', name: 'Japanese', flag: '🇯🇵' },
    { code : 'zh-cn', name: 'Chinese (Simplified)', flag: '🇨🇳' },
    { code : 'bn', name: 'Bengali', flag: '🇧🇩' },
    { code : 'bg', name: 'Bulgarian', flag: '🇧🇬' },
    { code : 'cs', name: 'Czech', flag: '🇨🇿' },
    { code : 'da', name: 'Danish', flag: '🇩🇰' },
    { code : 'et', name: 'Estonian', flag: '🇪🇪' },
    { code : 'ga', name: 'Irish', flag: '🇮🇪' },
    { code : 'el', name: 'Greek', flag: '🇬🇷' },
    { code : 'fi', name: 'Finnish', flag: '🇫🇮' },
    { code : 'hr', name: 'Croatian', flag: '🇭🇷' },
    { code : 'hu', name: 'Hungarian', flag: '🇭🇺' },
    { code : 'lt', name: 'Lithuanian', flag: '🇱🇹' },
    { code : 'lv', name: 'Latvian', flag: '🇱🇻' },
    { code : 'mt', name: 'Maltese', flag: '🇲🇹' },
    { code : 'ro', name: 'Romanian', flag: '🇷🇴' },
    { code : 'sk', name: 'Slovak', flag: '🇸🇰' },
    { code : 'sl', name: 'Slovenian', flag: '🇸🇮' },
    { code : 'sv', name: 'Swedish', flag: '🇸🇪' },
    { code : 'uk', name: 'Ukrainian', flag: '🇺🇦' },
    { code : 'ca', name: 'Catalan', flag: '🇪🇸' },
    { code : 'fa', name: 'Persian (Farsi)', flag: '🇮🇷' },
    { code : 'be', name: 'Belarusian', flag: '🇧🇾' }
]; 

const summaryTypes = [ 
  { value: 'brief', label: 'Brief Summary', description: 'Short and concise overview' }, 
  { value: 'detailed', label: 'Detailed Summary', description: 'Comprehensive analysis' }, 
  { value: 'bullet_points', label: 'Bullet Points', description: 'Key points in list format' } 
];

const SummaryOptions = ({ 
  selectedLanguage, 
  setSelectedLanguage, 
  selectedSummaryType, 
  setSelectedSummaryType, 
  activeTab 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      {/* Language Selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Language
        </label>
        <select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.flag} {lang.name}
            </option>
          ))}
        </select>
      </div>

      {/* Summary Type Selector (only for summarize tab) */}
      {activeTab === 'summarize' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Summary Type
          </label>
          <select
            value={selectedSummaryType}
            onChange={(e) => setSelectedSummaryType(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
          >
            {summaryTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label} – {type.description}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default SummaryOptions;