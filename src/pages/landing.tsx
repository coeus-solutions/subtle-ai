import React from 'react';
import { Link } from 'react-router-dom';
import { Video, Subtitles, Upload, Zap, Globe, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 bg-gradient-to-b from-blue-50 to-white flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center py-20">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Transform Your Videos with AI-Powered Subtitles
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Upload your videos and get accurate subtitles generated automatically using advanced AI technology.
            Perfect for content creators, educators, and businesses.
          </p>
          <div className="space-x-4">
            <Link to="/register">
              <Button size="lg" className="mr-4">Get Started Free</Button>
            </Link>
            <Link to="/about">
              <Button size="lg" variant="outline">Learn More</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Experience the Magic</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our powerful AI technology makes subtitle generation simple, fast, and accurate.
              Here's how it transforms your videos:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {/* Upload Feature */}
            <div className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Upload className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Easy Upload</h3>
              <p className="text-gray-600">
                Simply drag and drop your video files or browse to upload.
                We support all major video formats including MP4, AVI, and MOV.
              </p>
            </div>

            {/* Processing Feature */}
            <div className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">AI-Powered Analysis</h3>
              <p className="text-gray-600">
                Our advanced AI analyzes your video's audio track,
                transcribes speech with high accuracy, and generates
                perfectly timed subtitles.
              </p>
            </div>

            {/* Results Feature */}
            <div className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Subtitles className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Ready to Use</h3>
              <p className="text-gray-600">
                Download your subtitles in SRT format, ready to use
                with any video platform or editing software.
              </p>
            </div>
          </div>

          {/* Additional Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 mt-12">
            {/* Speed Feature */}
            <div className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Lightning Fast</h3>
              <p className="text-gray-600">
                Get your subtitles in minutes, not hours. Our AI processes
                your videos quickly without compromising on accuracy.
              </p>
            </div>

            {/* Language Feature */}
            <div className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Globe className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Multiple Languages</h3>
              <p className="text-gray-600">
                Support for multiple languages ensures your content
                reaches a global audience effectively.
              </p>
            </div>

            {/* Quality Feature */}
            <div className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Video className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">High Quality</h3>
              <p className="text-gray-600">
                Get professional-grade subtitles with precise timing
                and accurate transcription every time.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}