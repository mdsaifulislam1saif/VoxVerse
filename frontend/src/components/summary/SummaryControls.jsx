import { FileText, Loader2, Mic } from 'lucide-react';

const SummaryControls = ({ summary, loading, text, handleSummarize, handleConvert }) => (
  <div className="mb-6">
    {!summary ? (
      // summarization
      <button
        onClick={handleSummarize}
        disabled={loading || !text.trim()} // disable if loading or text is empty
        className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg
                   hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {/* Show spinner if loading, else show icon */}
        {loading ? (
          <Loader2 className="animate-spin mr-2" size={20} />
        ) : (
          <FileText className="mr-2" size={20} />
        )}
        Summarize
      </button>
    ) : (
      // converting summary to audio
      <button
        onClick={handleConvert}
        disabled={loading}
        className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg
                   hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? (
          <Loader2 className="animate-spin mr-2" size={20} />
        ) : (
          <Mic className="mr-2" size={20} />
        )}
        Convert Summary to Audio
      </button>
    )}
  </div>
);
export default SummaryControls;
