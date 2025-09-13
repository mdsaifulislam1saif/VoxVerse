import React from 'react';
import { SUMMARY_TYPES } from '@utils/constants';

const SummarizeSelector = ({ selectedSummaryType, setSelectedSummaryType }) => {
  return (
    <div className="w-full">
      <label htmlFor="summaryType" className="block text-sm font-medium text-gray-700 mb-2">
        Summary Type
      </label>
      <select
        id="summaryType"
        value={selectedSummaryType}
        onChange={(e) => setSelectedSummaryType(e.target.value)}
        className="w-full h-12 px-4 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
      >
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
