import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Zap, Globe, ChevronLeft, ChevronRight, Play, Video, Presentation, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const showcaseVideos = [
  {
    title: "Professional Interviews",
    description: "Perfect for corporate videos and interviews",
    mockup: (
      <div className="relative w-full max-w-2xl mx-auto">
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 shadow-2xl border border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            </div>
            <div className="text-sm text-slate-400">interview_subtitles.mp4</div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Video className="w-5 h-5 text-blue-400" />
              </div>
              <div className="flex-1">
                <div className="h-2 bg-blue-400/20 rounded-full w-3/4 animate-pulse"></div>
              </div>
            </div>
            <div className="pl-14 space-y-2">
              <div className="h-2 bg-slate-600/50 rounded-full w-full"></div>
              <div className="h-2 bg-slate-600/50 rounded-full w-5/6"></div>
              <div className="h-2 bg-slate-600/50 rounded-full w-4/6"></div>
            </div>
          </div>
        </div>
        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-blue-500/30 rounded-full blur-2xl"></div>
        <div className="absolute -top-6 -left-6 w-24 h-24 bg-purple-500/30 rounded-full blur-2xl"></div>
      </div>
    )
  },
  {
    title: "Educational Content",
    description: "Make your tutorials accessible to everyone",
    mockup: (
      <div className="relative w-full max-w-2xl mx-auto">
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 shadow-2xl border border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            </div>
            <div className="text-sm text-slate-400">tutorial_subtitles.mp4</div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <Presentation className="w-5 h-5 text-purple-400" />
              </div>
              <div className="flex-1">
                <div className="h-2 bg-purple-400/20 rounded-full w-3/4 animate-pulse"></div>
              </div>
            </div>
            <div className="pl-14 space-y-2">
              <div className="h-2 bg-slate-600/50 rounded-full w-full"></div>
              <div className="h-2 bg-slate-600/50 rounded-full w-5/6"></div>
              <div className="h-2 bg-slate-600/50 rounded-full w-4/6"></div>
            </div>
          </div>
        </div>
        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-purple-500/30 rounded-full blur-2xl"></div>
        <div className="absolute -top-6 -left-6 w-24 h-24 bg-pink-500/30 rounded-full blur-2xl"></div>
      </div>
    )
  },
  {
    title: "Social Media",
    description: "Boost engagement with auto-subtitles",
    mockup: (
      <div className="relative w-full max-w-2xl mx-auto">
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 shadow-2xl border border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            </div>
            <div className="text-sm text-slate-400">social_subtitles.mp4</div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                <Share2 className="w-5 h-5 text-indigo-400" />
              </div>
              <div className="flex-1">
                <div className="h-2 bg-indigo-400/20 rounded-full w-3/4 animate-pulse"></div>
              </div>
            </div>
            <div className="pl-14 space-y-2">
              <div className="h-2 bg-slate-600/50 rounded-full w-full"></div>
              <div className="h-2 bg-slate-600/50 rounded-full w-5/6"></div>
              <div className="h-2 bg-slate-600/50 rounded-full w-4/6"></div>
            </div>
          </div>
        </div>
        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-indigo-500/30 rounded-full blur-2xl"></div>
        <div className="absolute -top-6 -left-6 w-24 h-24 bg-blue-500/30 rounded-full blur-2xl"></div>
      </div>
    )
  }
];

export function LandingPage() {
  const [currentVideo, setCurrentVideo] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!isPlaying) {
        setCurrentVideo((prev) => (prev + 1) % showcaseVideos.length);
      }
    }, 5000);
    return () => clearInterval(timer);
  }, [isPlaying]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950 to-slate-900 text-white relative overflow-hidden">
      {/* Gradient Orbs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-[blob_7s_infinite]"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-[blob_7s_infinite_2s]"></div>
      <div className="absolute -bottom-8 left-20 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-[blob_7s_infinite_4s]"></div>

      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          {/* Hero Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              AI-Powered Subtitles Made Simple
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-8">
              Transform your videos with accurate subtitles in minutes. Powered by advanced AI for maximum precision and efficiency.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to="/register">
                  <Button size="lg" className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all">
                    Try for Free
                  </Button>
                </Link>
              </motion.div>
              <p className="text-slate-400">
                $0.10/minute • Pay as you go
              </p>
            </div>
          </motion.div>

          {/* Video Showcase Carousel */}
          <div className="mb-20 relative">
            <div className="relative rounded-2xl overflow-hidden p-8">
              <motion.div
                key={currentVideo}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    {showcaseVideos[currentVideo].title}
                  </h3>
                  <p className="text-slate-300 text-lg">
                    {showcaseVideos[currentVideo].description}
                  </p>
                </div>
                {showcaseVideos[currentVideo].mockup}
              </motion.div>
              
              <div className="absolute left-0 right-0 bottom-0 flex justify-center gap-2 mt-6">
                {showcaseVideos.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentVideo(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      currentVideo === index 
                        ? 'bg-blue-400 w-8' 
                        : 'bg-slate-600 hover:bg-slate-500'
                    }`}
                  />
                ))}
              </div>

              <button 
                onClick={() => setCurrentVideo((prev) => (prev - 1 + showcaseVideos.length) % showcaseVideos.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 rounded-full p-2 backdrop-blur-sm transition-all"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button 
                onClick={() => setCurrentVideo((prev) => (prev + 1) % showcaseVideos.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 rounded-full p-2 backdrop-blur-sm transition-all"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Features Section */}
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {[
              {
                icon: <Sparkles className="w-6 h-6 text-blue-400" />,
                title: "Lightning Fast",
                description: "Get your subtitles in minutes, not hours. Our AI processes your videos with remarkable speed.",
                color: "blue"
              },
              {
                icon: <Zap className="w-6 h-6 text-purple-400" />,
                title: "High Accuracy",
                description: "Powered by OpenAI's advanced models for exceptional accuracy and natural language understanding.",
                color: "purple"
              },
              {
                icon: <Globe className="w-6 h-6 text-indigo-400" />,
                title: "Multiple Languages",
                description: "Support for multiple languages and instant subtitle downloads in various formats.",
                color: "indigo"
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                whileHover={{ y: -5 }}
                className="backdrop-blur-lg bg-white/5 rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-${feature.color}-500/10 mb-6`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4 text-white">{feature.title}</h3>
                <p className="text-slate-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Call to Action */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="backdrop-blur-lg bg-white/5 rounded-2xl p-8 md:p-12 border border-white/10 inline-block">
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Ready to Get Started?
              </h2>
              <p className="text-slate-300 mb-6">
                No credit card required. Try it free and only pay for what you use.
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to="/register">
                  <Button size="lg" className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all">
                    Start Generating Subtitles
                  </Button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      <style>
        {`
          @keyframes blob {
            0% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
            100% { transform: translate(0px, 0px) scale(1); }
          }
        `}
      </style>
    </div>
  );
}