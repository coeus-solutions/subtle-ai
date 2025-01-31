import React from 'react';
import { User } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export function SettingsPage() {
  const { user } = useAuth();

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        <p className="mt-1 text-gray-600">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-6 max-w-2xl">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
            <User className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">Account Information</h3>
            <p className="text-sm text-gray-500">Your account details and email</p>
          </div>
        </div>

        <div className="mt-6 border-t pt-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email Address</label>
              <p className="mt-1 text-gray-900">{user?.email}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 