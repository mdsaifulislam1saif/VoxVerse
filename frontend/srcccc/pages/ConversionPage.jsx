import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTabs } from '../hooks/useTabs';
import { useFileUpload } from '../hooks/useFileUpload';
import { useAudio } from '../hooks/useAudio';
import { useSummary } from '../hooks/useSummary';

import AuthForm from '../components/Auth/AuthForm';
import Header from '../components/Layout/Header';
import Tabs from '../components/Layout/Tabs';
import FileUpload from '../components/Upload/FileUpload';
import TextEditor from '../components/Text/TextEditor';
import AudioPlayer from '../components/Audio/AudioPlayer';

const ConversionPage = () => {
  // Auth state
  const {
    user,
    token,
    showLogin,
    authMode,
    authData,
    setAuthData,
    showPassword,
    setShowPassword,
    loading: authLoading,
    handleAuth,
    logout,
    switchAuthMode
  } = useAuth();

  // Tab state
  const { activeTab, setActiveTab } = useTabs();

  // App state
  const [text, setText] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [selectedSummaryType, setSelectedSummaryType] = useState('brief');

  // File upload hook
  const { uploadLoading, handleFileUpload } = useFileUpload(
    token, 
    selectedLanguage, 
    setText, 
    () => logout()
  );

  // Audio hook
  const {
    audioUrl,
    isPlaying,
    loading: audioLoading,
    audioRef,
    convertToAudio,
    togglePlayback,
    downloadAudio,
    resetAudio
  } = useAudio(token, selectedLanguage, () => logout());

  // Summary hook
  const {
    summary,
    loading: summaryLoading,
    convertToSummaryThenAudio,
    resetSummary
  } = useSummary(
    token, 
    selectedLanguage, 
    selectedSummaryType, 
    () => logout(), 
    (url) => {
      resetAudio();
      // Set audio URL from summary hook
      audioRef.current = null;
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.src = url;
        }
      }, 100);
    }
  );

  // Handle logout with cleanup
  const handleLogout = () => {
    logout();
    setText('');
    resetSummary();
    resetAudio();
  };

  if (showLogin) {
    return (
      <AuthForm
        authMode={authMode}
        authData={authData}
        setAuthData={setAuthData}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        loading={authLoading}
        handleAuth={handleAuth}
        switchAuthMode={switchAuthMode}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Header user={user} logout={handleLogout} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <FileUpload 
            uploadLoading={uploadLoading}
            handleFileUpload={handleFileUpload}
          />

          <TextEditor
            text={text}
            setText={setText}
            summary={summary}
            activeTab={activeTab}
            selectedLanguage={selectedLanguage}
            setSelectedLanguage={setSelectedLanguage}
            selectedSummaryType={selectedSummaryType}
            setSelectedSummaryType={setSelectedSummaryType}
            loading={audioLoading || summaryLoading}
            convertToAudio={convertToAudio}
            convertToSummaryThenAudio={convertToSummaryThenAudio}
          />
        </div>

        {/* Audio Player Section */}
        {audioUrl && (
          <div className="mt-8">
            <AudioPlayer
              audioUrl={audioUrl}
              audioRef={audioRef}
              isPlaying={isPlaying}
              togglePlayback={togglePlayback}
              downloadAudio={downloadAudio}
              setIsPlaying={(playing) => {
                // This would need to be handled differently in the actual implementation
                // since we can't directly set state from a different hook
              }}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default ConversionPage;