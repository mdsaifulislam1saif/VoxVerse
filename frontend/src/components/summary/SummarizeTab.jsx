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
    text,
    setText,
    summary,
    selectedLanguage,
    setSelectedLanguage,
    selectedSummaryType,
    setSelectedSummaryType,
    showSummary,
    setShowSummary,
    summarizeLoading,
    summarizeProgress,
    handleSummarize,
  } = useSummarize();

  const {
    audioUrl, 
    convertTextToAudio, 
    convertProgress, 
    convertLoading
  } = useTextToAudio();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <FileUpload setText={setText} selectedLanguage={selectedLanguage} />

      <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">Text to Summarize</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <LanguageSelector selectedLanguage={selectedLanguage} setSelectedLanguage={setSelectedLanguage} />
          <SummarizeSelector selectedSummaryType={selectedSummaryType} setSelectedSummaryType={setSelectedSummaryType} />
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste text here..."
          className="w-full h-48 p-4 text-gray-800 border rounded-lg mb-6 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {summary && (
          <SummaryDisplay summary={summary} showSummary={showSummary} setShowSummary={setShowSummary} />
        )}

        <SummaryControls
          summary={summary}
          loading={summarizeLoading || convertLoading}
          text={text}
          handleSummarize={handleSummarize}
          handleConvert={() => convertTextToAudio(summary, selectedLanguage)}
        />
        {audioUrl && <AudioPlayer audioUrl={audioUrl} />}
      </div>

      {/* Show different overlays */}
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
