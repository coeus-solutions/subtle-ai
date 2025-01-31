import React, { useState, useEffect } from 'react';
import { Timer, DollarSign, Gift, CreditCard } from 'lucide-react';
import { users } from '@/lib/api-client';
import type { UserDetails } from '@/lib/api-client';

type StatColor = 'blue' | 'green' | 'purple' | 'indigo';

interface StatItem {
  title: string;
  value: string;
  unit: 'minutes' | 'USD';
  icon: React.ElementType;
  description: string;
  color: StatColor;
}

export function BillingPage() {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setIsLoading(true);
        const details = await users.me();
        setUserDetails(details);
        setError(null);
      } catch (err) {
        setError('Failed to load usage details');
        console.error('Error fetching user details:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Billing & Usage</h1>
          <p className="mt-1 text-gray-600">
            Monitor your video processing usage and costs
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border p-6 animate-pulse">
              <div className="h-8 w-8 bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!userDetails) {
    return null;
  }

  const stats: StatItem[] = [
    {
      title: 'Total Minutes Used',
      value: userDetails.minutes_consumed.toFixed(1),
      unit: 'minutes',
      icon: Timer,
      description: 'Total video minutes processed',
      color: 'blue'
    },
    {
      title: 'Free Minutes Used',
      value: userDetails.free_minutes_used.toFixed(1),
      unit: 'minutes',
      icon: Gift,
      description: `of ${userDetails.free_minutes_allocation} free minutes`,
      color: 'green'
    },
    {
      title: 'Total Cost',
      value: userDetails.total_cost.toFixed(2),
      unit: 'USD',
      icon: DollarSign,
      description: 'Total charges after free minutes',
      color: 'purple'
    },
    {
      title: 'Cost per Minute',
      value: userDetails.cost_per_minute.toFixed(2),
      unit: 'USD',
      icon: CreditCard,
      description: 'Standard rate per minute',
      color: 'indigo'
    }
  ];

  const colorClasses: Record<StatColor, string> = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    indigo: 'bg-indigo-50 text-indigo-600'
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Billing & Usage</h1>
        <p className="mt-1 text-gray-600">
          Monitor your video processing usage and costs
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="bg-white rounded-xl shadow-sm border p-6">
              <div className={`${colorClasses[stat.color]} inline-flex p-2 rounded-lg mb-4`}>
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                {stat.value}
                <span className="text-sm text-gray-500 ml-1">{stat.unit}</span>
              </h3>
              <p className="text-sm text-gray-500">{stat.title}</p>
              <p className="text-xs text-gray-400 mt-1">{stat.description}</p>
            </div>
          );
        })}
      </div>

      {userDetails.free_minutes_allocation > 0 && (
        <div className="mt-8 bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Free Minutes Usage</h3>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-green-600 h-2.5 rounded-full"
              style={{
                width: `${Math.min(
                  (userDetails.free_minutes_used / userDetails.free_minutes_allocation) * 100,
                  100
                )}%`,
              }}
            ></div>
          </div>
          <div className="flex justify-between mt-2">
            <p className="text-sm text-gray-500">
              {userDetails.free_minutes_used.toFixed(1)} / {userDetails.free_minutes_allocation} minutes used
            </p>
            <p className="text-sm text-gray-500">
              {Math.max(
                userDetails.free_minutes_allocation - userDetails.free_minutes_used,
                0
              ).toFixed(1)} minutes remaining
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
} 
