import React from 'react';
import { Mail } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Profile Settings</h1>

      <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
        <div className="flex items-center space-x-4">
          <div className="p-3 rounded-lg bg-blue-50">
            <Mail className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Email Address
            </label>
            <p className="text-lg font-medium text-gray-900">
              {user?.email}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}