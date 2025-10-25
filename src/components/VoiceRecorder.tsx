import React, { useState, useRef } from 'react';
import { Mic, Square, Play, Pause, Save, X } from 'lucide-react';

interface VoiceRecorderProps {
  onSave: (audioBlob: string, duration: number, title: string) => void;
  onCancel: () => void;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  onSave,
  onCancel
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [duration, setDuration] = useState(0);
  const [title, setTitle] = useState('');
  const [recordingTime, setRecordingTime] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (e) => {
        chunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setDuration(recordingTime);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const playRecording = () => {
    if (audioBlob) {
      const url = URL.createObjectURL(audioBlob);
      audioRef.current = new Audio(url);
      audioRef.current.play();
      setIsPlaying(true);
      
      audioRef.current.onended = () => {
        setIsPlaying(false);
      };
    }
  };

  const pauseRecording = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleSave = () => {
    if (audioBlob && title.trim()) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        onSave(base64String, duration, title.trim());
      };
      reader.readAsDataURL(audioBlob);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-zinc-800 rounded-2xl p-6 max-w-md mx-auto">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-white mb-2">Voice Recorder</h3>
        <p className="text-gray-400">
          {isRecording ? 'Recording...' : audioBlob ? 'Recording Complete' : 'Ready to Record'}
        </p>
      </div>

      {/* Recording Controls */}
      <div className="flex justify-center items-center space-x-4 mb-6">
        {!isRecording && !audioBlob && (
          <button
            onClick={startRecording}
            className="p-4 bg-red-600 hover:bg-red-700 text-white rounded-full transition-all duration-200 transform hover:scale-105"
          >
            <Mic size={24} />
          </button>
        )}
        
        {isRecording && (
          <>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-red-400 font-mono">
                {formatTime(recordingTime)}
              </span>
            </div>
            <button
              onClick={stopRecording}
              className="p-4 bg-zinc-600 hover:bg-zinc-700 text-white rounded-full transition-all duration-200"
            >
              <Square size={24} />
            </button>
          </>
        )}
        
        {audioBlob && (
          <div className="flex items-center space-x-2">
            <span className="text-gray-400 font-mono">
              {formatTime(duration)}
            </span>
            <button
              onClick={isPlaying ? pauseRecording : playRecording}
              className="p-4 bg-violet-600 hover:bg-violet-700 text-white rounded-full transition-all duration-200"
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>
          </div>
        )}
      </div>

      {/* Title Input */}
      {audioBlob && (
        <div className="mb-6">
          <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
            Note Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a title for your voice note..."
            className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
          />
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <button
          onClick={onCancel}
          className="flex-1 py-2 px-4 bg-zinc-600 hover:bg-zinc-700 text-white rounded-lg font-medium transition-all duration-200 flex items-center justify-center"
        >
          <X size={18} className="mr-2" />
          Cancel
        </button>
        
        {audioBlob && (
          <button
            onClick={handleSave}
            disabled={!title.trim()}
            className="flex-1 py-2 px-4 bg-gradient-to-r from-red-600 to-violet-600 hover:from-red-700 hover:to-violet-700 text-white rounded-lg font-medium transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={18} className="mr-2" />
            Save Note
          </button>
        )}
      </div>
    </div>
  );
};