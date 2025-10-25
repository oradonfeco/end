import React, { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { LoginPage } from './components/LoginPage';
import { Dashboard } from './components/Dashboard';
import { VaultPage } from './components/VaultPage';
import { ProfilePage } from './components/ProfilePage';
import { supabase } from './supabaseClient'; 
import { User, VoiceNote } from './types';

function App() {
  const [currentPage, setCurrentPage] = useState<string>('login');
  const [user, setUser] = useState<User | null>(null);
  const [voiceNotes, setVoiceNotes] = useState<VoiceNote[]>([]);

  // ✅ Session check on first load
  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      const session = data?.session;

      if (session?.user) {
        const endUser: User = {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.email?.split('@')[0] || 'Anonymous',
          createdAt: session.user.created_at || new Date().toISOString(),
        };

        setUser(endUser);
        setCurrentPage('dashboard');
      }
    };

    getSession();

    // Load voice notes from localStorage
    const savedNotes = localStorage.getItem('end-voice-notes');
    if (savedNotes) {
      setVoiceNotes(JSON.parse(savedNotes));
    }
  }, []);

  // ✅ Supabase Login
  const handleLogin = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert('Login failed: ' + error.message);
      return;
    }

    const { user } = data;

    if (user) {
      const endUser: User = {
        id: user.id,
        email: user.email || '',
        name: user.email?.split('@')[0] || 'Anonymous',
        createdAt: user.created_at || new Date().toISOString(),
      };

      setUser(endUser);
      localStorage.setItem('end-user', JSON.stringify(endUser));
      setCurrentPage('dashboard');
    }
  };

  // ✅ Supabase Signup
  const handleSignup = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert('Signup failed: ' + error.message);
      return;
    }

    alert('Signup successful! Please check your email to confirm.');

    // Optional: auto-login after signup
    await handleLogin(email, password);
  };

  // ✅ Supabase Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    localStorage.removeItem('end-user');
    setCurrentPage('login');
  };

  const addVoiceNote = (note: Omit<VoiceNote, 'id'>) => {
    const newNote: VoiceNote = {
      ...note,
      id: Date.now().toString(),
    };

    const updatedNotes = [...voiceNotes, newNote];
    setVoiceNotes(updatedNotes);
    localStorage.setItem('end-voice-notes', JSON.stringify(updatedNotes));
  };

  const deleteVoiceNote = (id: string) => {
    const updatedNotes = voiceNotes.filter(note => note.id !== id);
    setVoiceNotes(updatedNotes);
    localStorage.setItem('end-voice-notes', JSON.stringify(updatedNotes));
  };

  if (!user) {
    return (
      <LoginPage
        onLogin={handleLogin}
        onSignup={handleSignup}
      />
    );
  }

  return (
    <div className="min-h-screen bg-black text-gray-100">
      <Navigation
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        onLogout={handleLogout}
      />

      <main className="pt-16">
        {currentPage === 'dashboard' && (
          <Dashboard
            user={user}
            voiceNotes={voiceNotes}
            onAddNote={addVoiceNote}
            onDeleteNote={deleteVoiceNote}
          />
        )}

        {currentPage === 'vault' && (
          <VaultPage
            voiceNotes={voiceNotes}
            onDeleteNote={deleteVoiceNote}
          />
        )}

        {currentPage === 'profile' && (
          <ProfilePage user={user} />
        )}
      </main>
    </div>
  );
}

export default App;
