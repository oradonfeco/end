import React from 'react';
import { User } from '../types';
import { User as UserIcon, Mail, Calendar, Shield, Award } from 'lucide-react';

interface ProfilePageProps {
  user: User;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ user }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-black px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-gradient-to-r from-red-600/20 to-violet-600/20 rounded-full border border-red-600/30">
              <UserIcon className="h-8 w-8 text-red-400" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Profile
          </h1>
          <p className="text-gray-400 text-lg">
            Manage your Voice Vault settings
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-zinc-900/50 rounded-2xl p-8 border border-zinc-800 mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-violet-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xl font-bold">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{user.name}</h2>
              <p className="text-gray-400">Voice Vault User</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <p className="text-white">{user.email}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-400">Member Since</p>
                  <p className="text-white">{formatDate(user.createdAt)}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-400">Security Status</p>
                  <p className="text-green-400">Active</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Award className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-400">Plan</p>
                  <p className="text-white">Free Tier</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="bg-zinc-900/50 rounded-2xl p-8 border border-zinc-800">
          <h3 className="text-xl font-bold text-white mb-6">Settings</h3>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Audio Quality</p>
                <p className="text-sm text-gray-400">High quality recording</p>
              </div>
              <div className="w-12 h-6 bg-red-600 rounded-full p-1">
                <div className="w-4 h-4 bg-white rounded-full transform translate-x-6 transition-transform"></div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Auto-save</p>
                <p className="text-sm text-gray-400">Automatically save recordings</p>
              </div>
              <div className="w-12 h-6 bg-red-600 rounded-full p-1">
                <div className="w-4 h-4 bg-white rounded-full transform translate-x-6 transition-transform"></div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Notifications</p>
                <p className="text-sm text-gray-400">Daily recording reminders</p>
              </div>
              <div className="w-12 h-6 bg-zinc-600 rounded-full p-1">
                <div className="w-4 h-4 bg-white rounded-full transition-transform"></div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-zinc-700">
            <button className="w-full py-3 px-4 bg-gradient-to-r from-red-600 to-violet-600 hover:from-red-700 hover:to-violet-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105">
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};