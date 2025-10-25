import React, { useState } from 'react';
import { VoiceNote } from '../types';
import { Play, Pause, Trash2, Clock } from 'lucide-react';

interface VoiceNoteCardProps {
  note: VoiceNote;
  onDelete: (id: string) => void;
}

export const VoiceNoteCard: React.FC<VoiceNoteCardProps> = ({
  note,
  onDelete
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  const playAudio = () => {
    if (audioElement) {
      audioElement.pause();
      setAudioElement(null);
      setIsPlaying(false);
      return;
    }

    const audio = new Audio(note.audioBlob);
    setAudioElement(audio);
    setIsPlaying(true);
    
    audio.play();
    audio.onended = () => {
      setIsPlaying(false);
      setAudioElement(null);
    };
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700 hover:border-zinc-600 transition-all duration-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-white font-medium mb-1">{note.title}</h3>
          <div className="flex items-center space-x-4 text-sm text-gray-400">
            <span className="flex items-center">
              <Clock size={14} className="mr-1" />
              {formatTime(note.duration)}
            </span>
            <span>{formatDate(note.createdAt)}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={playAudio}
            className="p-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </button>
          
          <button
            onClick={() => onDelete(note.id)}
            className="p-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};