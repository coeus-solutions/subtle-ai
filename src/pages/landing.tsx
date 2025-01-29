import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, Zap, Globe, ChevronLeft, ChevronRight, 
  Play, Video, Presentation, Share2, Download,
  Languages, Subtitles, PlayCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from '@/components/ui/logo';

const SUPPORTED_LANGUAGES = [
  "English", "German", "Spanish", "French", "Japanese"
];

const showcaseVideos = [
  {
    title: "Instant Language Translation",
    description: "Generate subtitles in multiple languages instantly",
    mockup: (
      <div className="relative w-full max-w-2xl mx-auto h-[400px] flex items-center">
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 shadow-2xl border border-white/10 w-full">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            </div>
            <div className="text-sm text-slate-400">multilingual_demo.mp4</div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Languages className="w-5 h-5 text-blue-400" />
              </div>
              <div className="flex-1">
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {SUPPORTED_LANGUAGES.map((lang, i) => (
                    <span key={lang} className="px-2 py-1 rounded-full bg-blue-500/10 text-blue-300 text-xs whitespace-nowrap">
                      {lang}
                    </span>
                  ))}
                </div>
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
    title: "Real-Time Preview",
    description: "Watch your video with subtitles instantly",
    mockup: (
      <div className="relative w-full max-w-2xl mx-auto h-[400px] flex items-center">
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 shadow-2xl border border-white/10 w-full">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            </div>
            <div className="text-sm text-slate-400">preview_player.mp4</div>
          </div>
          <div className="space-y-4">
            <div className="aspect-video bg-slate-900/50 rounded-lg relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <PlayCircle className="w-12 h-12 text-blue-400 animate-pulse" />
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <div className="h-2 bg-blue-400/20 rounded-full w-full">
                  <div className="h-full w-1/3 bg-blue-400 rounded-full"></div>
                </div>
                <div className="mt-4 px-4 py-2 bg-black/50 backdrop-blur-sm rounded-lg">
                  <div className="h-2 bg-white rounded-full w-3/4"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-purple-500/30 rounded-full blur-2xl"></div>
        <div className="absolute -top-6 -left-6 w-24 h-24 bg-pink-500/30 rounded-full blur-2xl"></div>
      </div>
    )
  },
  {
    title: "Export & Download",
    description: "Download subtitles in SRT format",
    mockup: (
      <div className="relative w-full max-w-2xl mx-auto h-[400px] flex items-center">
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 shadow-2xl border border-white/10 w-full">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            </div>
            <div className="text-sm text-slate-400">export_options.mp4</div>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                <Download className="w-6 h-6 text-indigo-400 mb-2" />
                <div className="h-2 bg-indigo-400/20 rounded-full w-3/4"></div>
                <div className="mt-2 h-2 bg-indigo-400/20 rounded-full w-1/2"></div>
              </div>
              <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
                <Subtitles className="w-6 h-6 text-purple-400 mb-2" />
                <div className="h-2 bg-purple-400/20 rounded-full w-3/4"></div>
                <div className="mt-2 h-2 bg-purple-400/20 rounded-full w-1/2"></div>
              </div>
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
  const [currentLanguage, setCurrentLanguage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!isPlaying) {
        setCurrentVideo((prev) => (prev + 1) % showcaseVideos.length);
      }
    }, 5000);

    const langTimer = setInterval(() => {
      setCurrentLanguage((prev) => (prev + 1) % SUPPORTED_LANGUAGES.length);
    }, 2000);

    return () => {
      clearInterval(timer);
      clearInterval(langTimer);
    };
  }, [isPlaying]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950 to-slate-900 text-white">
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-b z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Logo textClassName="text-gray-900" />
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="relative pt-16">
        {/* Animated Gradient Orbs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-[blob_7s_infinite]"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-[blob_7s_infinite_2s]"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-[blob_7s_infinite_4s]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          {/* Hero Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                AI-Powered Subtitles
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
                In Any Language
              </span>
            </h1>
            <motion.p 
              className="text-xl text-slate-300 max-w-3xl mx-auto mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Transform your videos with instant, accurate subtitles in{' '}
              <AnimatePresence mode="wait">
                <motion.span
                  key={currentLanguage}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-blue-400 font-semibold"
                >
                  {SUPPORTED_LANGUAGES[currentLanguage]}
                </motion.span>
              </AnimatePresence>
              . Powered by advanced AI for maximum precision.
            </motion.p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to="/register">
                  <Button size="lg" className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all group">
                    <span>Try for Free</span>
                    <Sparkles className="w-5 h-5 ml-2 group-hover:animate-pulse" />
                  </Button>
                </Link>
              </motion.div>
              <motion.p 
                className="text-slate-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                $0.10/minute • Pay as you go
              </motion.p>
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
                  <motion.h3 
                    className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {showcaseVideos[currentVideo].title}
                  </motion.h3>
                  <motion.p 
                    className="text-slate-300 text-xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {showcaseVideos[currentVideo].description}
                  </motion.p>
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

              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setCurrentVideo((prev) => (prev - 1 + showcaseVideos.length) % showcaseVideos.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 rounded-full p-2 backdrop-blur-sm transition-all"
              >
                <ChevronLeft className="w-6 h-6" />
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setCurrentVideo((prev) => (prev + 1) % showcaseVideos.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 rounded-full p-2 backdrop-blur-sm transition-all"
              >
                <ChevronRight className="w-6 h-6" />
              </motion.button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {[
              {
                icon: <Languages className="w-6 h-6 text-blue-400" />,
                title: "Multiple Languages",
                description: "Generate subtitles in multiple languages instantly. Perfect for global reach.",
                color: "blue"
              },
              {
                icon: <PlayCircle className="w-6 h-6 text-purple-400" />,
                title: "Instant Preview",
                description: "Watch your video with subtitles immediately after generation.",
                color: "purple"
              },
              {
                icon: <Download className="w-6 h-6 text-indigo-400" />,
                title: "Easy Export",
                description: "Download subtitles in SRT format for use anywhere.",
                color: "indigo"
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                whileHover={{ y: -5 }}
                className="backdrop-blur-lg bg-white/5 rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all group"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-${feature.color}-500/10 mb-6 group-hover:scale-110 transition-transform`}>
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
                  <Button size="lg" className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all group">
                    <span>Start Generating Subtitles</span>
                    <Sparkles className="w-5 h-5 ml-2 group-hover:animate-pulse" />
                  </Button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </main>

      <style>
        {`
          @keyframes blob {
            0% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
            100% { transform: translate(0px, 0px) scale(1); }
          }
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}
      </style>
    </div>
  );
}