const SummaryResult = ({ summary, activeTab }) => {
  if (activeTab !== 'summarize' || !summary) {
    return null;
  }

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Generated Summary</h3>
      <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
        <p className="text-gray-700 leading-relaxed">{summary}</p>
      </div>
    </div>
  );
};

export default SummaryResult;