import FileUpload from '../conversion/FileUpload';
import LanguageSelector from '../conversion/LanguageSelector';
import SummarizeSelector from './SummarizeSelector';
import AudioPlayer from '../conversion/AudioPlayer';
import SummaryDisplay from './SummaryDisplay';
import SummaryControls from './SummaryControls';
import { useSummarize } from '../../hook/useSummarize';
import LoadingOverlay from '../progress/LoadingOverlay';
import { useTextToAudio } from '../../hook/useTextToAudio';

export const SummarizeTab = () => {
  const {
    text,                     // Input text from user
    setText,                  // Function to update input text
    summary,                  // Generated summary text
    selectedLanguage,         // Currently selected language
    setSelectedLanguage,      // Function to update selected language
    selectedSummaryType,      // Type of summary (e.g., brief, detailed)
    setSelectedSummaryType,   // Function to update summary type
    showSummary,              // Boolean: whether summary is visible
    setShowSummary,           // Function to toggle summary visibility
    summarizeLoading,         // Loading state for summarization
    summarizeProgress,        // Progress percentage for summarization
    handleSummarize,          // Function to trigger summarization
  } = useSummarize();

  const {
    audioUrl,                 // URL of generated audio
    convertTextToAudio,       // Function to convert text to audio
    convertProgress,          // Progress percentage for audio conversion
    convertLoading            // Loading state for audio conversion
  } = useTextToAudio();
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Panel: File Upload */}
      <FileUpload setText={setText} selectedLanguage={selectedLanguage} />
      {/* Main Panel: Summarization controls and output */}
      <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">Text to Summarize</h2>
        {/* Language and Summary Type Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <LanguageSelector
            selectedLanguage={selectedLanguage}
            setSelectedLanguage={setSelectedLanguage}
          />
          <SummarizeSelector
            selectedSummaryType={selectedSummaryType}
            setSelectedSummaryType={setSelectedSummaryType}
          />
        </div>
        {/* Textarea for user input */}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste text here..."
          className="w-full h-48 p-4 text-gray-800 border rounded-lg mb-6 resize-none
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {/* Display the generated summary if available */}
        {summary && (
          <SummaryDisplay
            summary={summary}
            showSummary={showSummary}
            setShowSummary={setShowSummary}
          />
        )}
        {/* Controls for summarization and converting summary to audio */}
        <SummaryControls
          summary={summary}
          loading={summarizeLoading || convertLoading} // Show loading if either process is active
          text={text}
          handleSummarize={handleSummarize}          // Button to generate summary
          handleConvert={() => convertTextToAudio(summary, selectedLanguage)} // Button to convert summary to audio
        />
        {/* Audio Player for playing converted audio */}
        {audioUrl && <AudioPlayer audioUrl={audioUrl} />}
      </div>
      {/* Loading overlays for async operations */}
      {summarizeLoading && (
        <LoadingOverlay
          title="Summarizing Text"
          description="Please wait while we summarize your text"
          progress={summarizeProgress}
        />
      )}
      {convertLoading && (
        <LoadingOverlay
          title="Converting to Audio"
          description="Please wait while we convert summary to audio"
          progress={convertProgress}
        />
      )}
    </div>
  );
};
