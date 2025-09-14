import { SUMMARY_TYPES } from "../../config/config";

const SummarizeSelector = ({ selectedSummaryType, setSelectedSummaryType }) => {
  return (
    <div className="w-full">
      {/* Label for the dropdown */}
      <label 
        htmlFor="summaryType" 
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        Summary Type
      </label>
      {/* Dropdown to select summary type */}
      <select
        id="summaryType"
        value={selectedSummaryType}  // Current selected value
        onChange={(e) => setSelectedSummaryType(e.target.value)}  // Update selected value on change
        className="w-full h-12 px-4 border border-gray-300 rounded-lg text-gray-700 
                   focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
      >
        {/* Render each summary type as an option */}
        {SUMMARY_TYPES.map((type) => (
          <option key={type.value} value={type.value}>
            {type.label}
          </option>
        ))}
      </select>
    </div>
  );
};
export default SummarizeSelector;
