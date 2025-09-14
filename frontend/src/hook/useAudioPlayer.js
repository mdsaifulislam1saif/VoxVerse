import { useState, useRef, useEffect } from 'react';

export const useAudioPlayer = (audioUrl) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);

  // Setup event listeners when the component mounts
  useEffect(() => {
    if (!audioRef.current) return;
    const audio = audioRef.current;
    // Update progress percentage when audio time updates
    const updateProgress = () => setProgress((audio.currentTime / duration) * 100 || 0);
    // Set audio duration when metadata is loaded
    const setMetaData = () => setDuration(audio.duration || 0);
    // Handle audio ending
    const handleEnded = () => setIsPlaying(false);
    // Add event listeners to audio element
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', setMetaData);
    audio.addEventListener('ended', handleEnded);
    // Cleanup: remove event listeners when component dependency changes
    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('loadedmetadata', setMetaData);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [audioRef, duration]);
  // Toggle playback: play if paused, pause if playing
  const togglePlayback = () => {
    if (!audioRef.current) return;
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play();
    setIsPlaying(!isPlaying);
  };
  // Stop audio and reset to the beginning
  const stopAudio = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsPlaying(false);
  };
  // Trigger download of the audio file
  const downloadAudio = () => {
    if (!audioUrl) return;
    const a = document.createElement('a'); // Create temporary link element
    a.href = audioUrl; // Set file URL
    a.download = 'converted_audio.mp3'; // Set default file name
    document.body.appendChild(a); // Add link to DOM
    a.click(); // Trigger download
    document.body.removeChild(a); // Remove link after download
  };
  // Format seconds into MM:SS format for display
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60) || 0;
    const seconds = Math.floor(time % 60) || 0;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  return {
    audioRef,         // Ref to attach to <audio> element
    isPlaying,        // Boolean playback state
    duration,         // Total duration in seconds
    progress,         // Playback progress in percentage
    togglePlayback,   // Function to play/pause
    stopAudio,        // Function to stop and reset audio
    downloadAudio,    // Function to download audio file
    formatTime,       // Utility to format time for display
  };
};
