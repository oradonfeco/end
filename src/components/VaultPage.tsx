import React, { useState } from 'react';
import { VoiceNote } from '../types';
import { VoiceNoteCard } from './VoiceNoteCard';
import { Archive, Search, Shield } from 'lucide-react';

interface VaultPageProps {
  voiceNotes: VoiceNote[];
  onDeleteNote: (id: string) => void;
}

export const VaultPage: React.FC<VaultPageProps> = ({
  voiceNotes,
  onDeleteNote
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredNotes = voiceNotes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedNotes = [...filteredNotes].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="min-h-screen bg-black px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-gradient-to-r from-violet-600/20 to-red-600/20 rounded-full border border-violet-600/30">
              <Archive className="h-8 w-8 text-violet-400" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Voice Vault
          </h1>
          <p className="text-gray-400 text-lg">
            Your secure collection of emotional memories
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search your notes..."
              className="block w-full pl-10 pr-3 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-zinc-900/50 rounded-lg p-6 border border-zinc-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Notes</p>
                <p className="text-2xl font-bold text-white">{voiceNotes.length}</p>
              </div>
              <Archive className="h-8 w-8 text-violet-400" />
            </div>
          </div>
          
          <div className="bg-zinc-900/50 rounded-lg p-6 border border-zinc-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Duration</p>
                <p className="text-2xl font-bold text-white">
                  {Math.floor(voiceNotes.reduce((acc, note) => acc + note.duration, 0) / 60)}m
                </p>
              </div>
              <Shield className="h-8 w-8 text-red-400" />
            </div>
          </div>
          
          <div className="bg-zinc-900/50 rounded-lg p-6 border border-zinc-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">This Month</p>
                <p className="text-2xl font-bold text-white">
                  {voiceNotes.filter(note => {
                    const noteDate = new Date(note.createdAt);
                    const now = new Date();
                    return noteDate.getMonth() === now.getMonth() && 
                           noteDate.getFullYear() === now.getFullYear();
                  }).length}
                </p>
              </div>
              <Archive className="h-8 w-8 text-violet-400" />
            </div>
          </div>
        </div>

        {/* Notes List */}
        <div className="bg-zinc-900/50 rounded-2xl p-8 border border-zinc-800">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">
              All Voice Notes
            </h2>
            <span className="text-sm text-gray-400">
              {filteredNotes.length} of {voiceNotes.length} notes
            </span>
          </div>
          
          {sortedNotes.length === 0 ? (
            <div className="text-center py-12">
              <Archive className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg mb-2">
                {searchTerm ? 'No notes found matching your search' : 'No voice notes yet'}
              </p>
              <p className="text-gray-500">
                {searchTerm ? 'Try a different search term' : 'Start recording to build your vault'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedNotes.map((note) => (
                <div key={note.id} className="relative">
                  <VoiceNoteCard
                    note={note}
                    onDelete={onDeleteNote}
                  />
                  <div className="mt-2 text-xs text-gray-500 flex items-center">
                    <Shield size={12} className="mr-1" />
                    Blockchain proof pending - Hash: {note.id.slice(0, 16)}...
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};