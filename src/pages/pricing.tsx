import React from 'react';
import { Link } from 'react-router-dom';
import { Check, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Simple, Usage-Based Pricing
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Only pay for what you use. No subscriptions, no hidden fees.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {/* Main Pricing Card */}
          <div className="bg-white rounded-2xl shadow-lg border-2 border-blue-100 p-8 md:p-12">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 mb-4">
                <Zap className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Pay As You Go</h2>
              <div className="flex items-baseline justify-center mb-2">
                <span className="text-6xl font-bold text-gray-900">$0.10</span>
                <span className="text-xl text-gray-500 ml-2">/ minute</span>
              </div>
              <p className="text-gray-600">of video processed</p>
            </div>

            <div className="space-y-6 mb-8">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <Check className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-gray-900">No Monthly Fees</h3>
                  <p className="text-gray-600">Only pay for the minutes of video you process. Perfect for any volume.</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <Check className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-gray-900">High-Quality Subtitles</h3>
                  <p className="text-gray-600">Powered by OpenAI's advanced models for maximum accuracy.</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <Check className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-gray-900">All Features Included</h3>
                  <p className="text-gray-600">Multiple languages, instant downloads, and all export formats.</p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <Link to="/register">
                <Button size="lg" className="w-full md:w-auto md:px-12">
                  Get Started Free
                </Button>
              </Link>
              <p className="mt-4 text-sm text-gray-500">
                No credit card required to start
              </p>
            </div>
          </div>

          {/* Example Cost */}
          <div className="mt-12 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Example Cost</h3>
            <div className="inline-block rounded-lg bg-blue-50 px-6 py-4">
              <p className="text-gray-600">
                A 10-minute video would cost just <span className="font-bold text-gray-900">$1.00</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 