import React, { useState } from 'react';
import { User, VoiceNote } from '../types';
import { VoiceRecorder } from './VoiceRecorder';
import { VoiceNoteCard } from './VoiceNoteCard';
import { Mic, Archive } from 'lucide-react';

interface DashboardProps {
  user: User;
  voiceNotes: VoiceNote[];
  onAddNote: (note: Omit<VoiceNote, 'id'>) => void;
  onDeleteNote: (id: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  user,
  voiceNotes,
  onAddNote,
  onDeleteNote
}) => {
  const [showRecorder, setShowRecorder] = useState(false);
  const recentNotes = voiceNotes.slice(-5).reverse();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="min-h-screen bg-black px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            {getGreeting()}, {user.name}
          </h1>
          <p className="text-gray-400 text-lg">
            Your sacred space for emotional expression
          </p>
        </div>

        {/* Recording Section */}
        <div className="bg-zinc-900/50 rounded-2xl p-8 mb-8 border border-zinc-800">
          <div className="text-center">
            <div className="mb-6">
              <div className="inline-flex p-4 bg-gradient-to-r from-red-600/20 to-violet-600/20 rounded-full border border-red-600/30">
                <Mic className="h-8 w-8 text-red-400" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Capture Your Voice
            </h2>
            <p className="text-gray-400 mb-6">
              Record your thoughts, emotions, and memories
            </p>
            
            {!showRecorder ? (
              <button
                onClick={() => setShowRecorder(true)}
                className="px-8 py-3 bg-gradient-to-r from-red-600 to-violet-600 hover:from-red-700 hover:to-violet-700 text-white font-medium rounded-2xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black"
              >
                Start Recording
              </button>
            ) : (
              <VoiceRecorder
                onSave={(audioBlob, duration, title) => {
                  onAddNote({
                    title,
                    audioBlob,
                    duration,
                    createdAt: new Date().toISOString(),
                    userId: user.id
                  });
                  setShowRecorder(false);
                }}
                onCancel={() => setShowRecorder(false)}
              />
            )}
          </div>
        </div>

        {/* Recent Notes */}
        <div className="bg-zinc-900/50 rounded-2xl p-8 border border-zinc-800">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <Archive className="h-6 w-6 mr-2 text-violet-400" />
              Recent Notes
            </h2>
            <span className="text-sm text-gray-400">
              {voiceNotes.length} total notes
            </span>
          </div>
          
          {recentNotes.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400 text-lg">
                No voice notes yet. Start recording to capture your first memory.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentNotes.map((note) => (
                <VoiceNoteCard
                  key={note.id}
                  note={note}
                  onDelete={onDeleteNote}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};