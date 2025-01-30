import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, Zap, Globe, ChevronLeft, ChevronRight, 
  Play, Video, Presentation, Share2, Download,
  Languages, Subtitles, PlayCircle, ArrowRight, CheckCircle2,
  Clock, Twitter, Github, Linkedin, Youtube
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

const SUPPORTED_LANGUAGES = [
  "English", "German", "Spanish", "French", "Japanese"
];

const FEATURES = [
  {
    id: 1,
    icon: <Video className="w-8 h-8 text-blue-400" />,
    title: "Real-time Preview",
    description: "Watch your subtitles appear in real-time as they're being generated. Perfect timing and instant feedback for professional results.",
    image: "/screenshots/instant-preview.png",
    color: "blue",
    stats: [
      { label: "Processing Time", value: "< 2 mins" },
      { label: "Preview Delay", value: "None" },
      { label: "Accuracy Rate", value: "99%" },
      { label: "Video Formats", value: "All major" }
    ],
    floatingElements: [
      {
        icon: <Sparkles className="w-4 h-4 text-blue-400" />,
        text: "AI-Powered Generation",
        position: "top-right",
        color: "blue"
      },
      {
        icon: <Languages className="w-4 h-4 text-purple-400" />,
        text: "5 Languages",
        position: "bottom-left",
        color: "purple"
      }
    ]
  },
  {
    id: 2,
    icon: <Languages className="w-8 h-8 text-purple-400" />,
    title: "Multiple Languages",
    description: "Generate subtitles in five different languages instantly. Perfect for reaching a global audience with your content.",
    image: "/screenshots/target-language.png",
    color: "purple",
    stats: [
      { label: "Languages", value: "5+" },
      { label: "Translation Time", value: "Instant" },
      { label: "Accuracy", value: "98%" },
      { label: "Auto-Detection", value: "Yes" }
    ],
    floatingElements: [
      {
        icon: <Globe className="w-4 h-4 text-purple-400" />,
        text: "Global Reach",
        position: "top-right",
        color: "purple"
      },
      {
        icon: <CheckCircle2 className="w-4 h-4 text-blue-400" />,
        text: "Auto Language Detection",
        position: "bottom-left",
        color: "blue"
      }
    ]
  },
  {
    id: 3,
    icon: <Presentation className="w-8 h-8 text-pink-400" />,
    title: "Easy Management",
    description: "Organize and manage all your videos in one place. Simple and intuitive dashboard for efficient workflow.",
    image: "/screenshots/short-dashboard-view.png",
    color: "pink",
    stats: [
      { label: "Storage", value: "Unlimited" },
      { label: "Organization", value: "Folders" },
      { label: "Search", value: "Instant" },
      { label: "Sharing", value: "One-click" }
    ],
    floatingElements: [
      {
        icon: <Share2 className="w-4 h-4 text-pink-400" />,
        text: "Easy Sharing",
        position: "top-right",
        color: "pink"
      },
      {
        icon: <Download className="w-4 h-4 text-purple-400" />,
        text: "Quick Export",
        position: "bottom-left",
        color: "purple"
      }
    ]
  },
  {
    id: 4,
    icon: <Clock className="w-8 h-8 text-emerald-400" />,
    title: "Usage Analytics",
    description: "Track your usage and optimize your workflow with detailed analytics and insights.",
    image: "/screenshots/billing-n-usage.png",
    color: "emerald",
    stats: [
      { label: "Data Points", value: "20+" },
      { label: "Reports", value: "Weekly" },
      { label: "Export", value: "CSV/PDF" },
      { label: "History", value: "90 days" }
    ],
    floatingElements: [
      {
        icon: <ArrowRight className="w-4 h-4 text-emerald-400" />,
        text: "Detailed Insights",
        position: "top-right",
        color: "emerald"
      },
      {
        icon: <Download className="w-4 h-4 text-blue-400" />,
        text: "Export Reports",
        position: "bottom-left",
        color: "blue"
      }
    ]
  }
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

const features = [
  {
    title: "Instant Preview",
    description: "See generated subtitles in real-time with our embedded video player",
    icon: Video,
    image: "/screenshots/instant-preview.png"
  },
  {
    title: "Multiple Languages",
    description: "Generate subtitles in English, Spanish, French, German, and Japanese",
    icon: Globe,
    image: "/screenshots/target-language.png"
  },
  {
    title: "Quick Processing",
    description: "Fast and accurate subtitle generation powered by advanced AI",
    icon: Zap,
    image: "/screenshots/full-dashboard-page.png"
  },
  {
    title: "Usage Tracking",
    description: "Monitor your subtitle generation usage and billing in real-time",
    icon: Clock,
    image: "/screenshots/billing-n-usage.png"
  }
];

const benefits = [
  "Accurate subtitle generation",
  "Multiple language support",
  "Real-time video preview",
  "Easy subtitle downloads",
  "Simple video management",
  "Usage analytics",
  "Fast processing times",
  "Secure file handling"
];

export function LandingPage() {
  const [currentLanguage, setCurrentLanguage] = useState(0);
  const [currentFeature, setCurrentFeature] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    const langTimer = setInterval(() => {
      setCurrentLanguage((prev) => (prev + 1) % SUPPORTED_LANGUAGES.length);
    }, 2000);

    return () => clearInterval(langTimer);
  }, []);

  // Auto-rotate features
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const timer = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % FEATURES.length);
    }, 5000); // Change feature every 5 seconds

    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  const nextFeature = () => {
    setIsAutoPlaying(false);
    setCurrentFeature((prev) => (prev + 1) % FEATURES.length);
  };

  const prevFeature = () => {
    setIsAutoPlaying(false);
    setCurrentFeature((prev) => (prev - 1 + FEATURES.length) % FEATURES.length);
  };

  const goToFeature = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentFeature(index);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed w-full z-50 bg-black/80 backdrop-blur-lg border-b border-white/10"
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
          >
            <img
              src="/favicon.svg"
              alt="SubtleAI Logo"
              className="w-8 h-8 mr-2"
            />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              SubtleAI
            </span>
          </motion.div>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="outline" className="border-white/20 hover:border-white/40 hover:bg-white/5 text-gray-100 hover:text-white transition-colors font-medium bg-white/5">
                Sign in
              </Button>
            </Link>
            <Link to="/register">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500">
                  Get Started
                </Button>
              </motion.div>
            </Link>
          </div>
        </nav>
      </motion.header>

      <main>
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black pt-16">
          {/* Animated Background */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -inset-[10px] opacity-50">
              <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
              <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
              <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
            </div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <motion.h1 
                className="text-5xl md:text-7xl font-bold mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  Transform Your Videos
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  With AI-Powered Subtitles
                </span>
              </motion.h1>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="relative"
              >
                <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
                  Generate professional subtitles in{' '}
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
                  {' '}instantly with our cutting-edge AI technology.
                </p>
              </motion.div>

              <motion.div 
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Link to="/register">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all group">
                      Start Creating
                      <Sparkles className="w-5 h-5 ml-2 group-hover:animate-pulse" />
                    </Button>
                  </motion.div>
                </Link>
                <motion.p 
                  className="text-gray-400 font-medium"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  Try for free • No credit card required
                </motion.p>
              </motion.div>
            </motion.div>

            {/* Feature Carousel Section */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="mt-32 relative"
            >
              {/* Background Effects */}
              <div className="absolute inset-0 -z-10">
                <div className="absolute top-1/4 left-0 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-0 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse animation-delay-2000" />
              </div>

              {/* Section Title */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Powerful Features
                </h2>
                <p className="text-gray-400 max-w-2xl mx-auto">
                  Everything you need to create professional subtitles in minutes
                </p>
              </motion.div>

              {/* Feature Carousel */}
              <div className="max-w-7xl mx-auto px-4">
                <div className="relative">
                  <AnimatePresence mode="wait">
                    <motion.div 
                      key={currentFeature}
                      initial={{ opacity: 0, x: 100 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ duration: 0.5 }}
                      className="relative bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden"
                    >
                      <div className="grid md:grid-cols-2 gap-8 p-8">
                        {/* Feature Info */}
                        <div className="space-y-6">
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-start gap-4"
                          >
                            <div className={`p-3 bg-${FEATURES[currentFeature].color}-500/20 rounded-xl`}>
                              {FEATURES[currentFeature].icon}
                            </div>
                            <div>
                              <h3 className={`text-2xl font-bold text-${FEATURES[currentFeature].color}-200 mb-2`}>
                                {FEATURES[currentFeature].title}
                              </h3>
                              <p className="text-gray-400 leading-relaxed">
                                {FEATURES[currentFeature].description}
                              </p>
                            </div>
                          </motion.div>

                          {/* Feature Navigation */}
                          <div className="flex flex-wrap gap-4 mt-8">
                            {FEATURES.map((feature, index) => (
                              <motion.button
                                key={feature.id}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl ${
                                  currentFeature === index 
                                    ? `bg-${feature.color}-500/30 border-${feature.color}-500/50` 
                                    : `bg-${feature.color}-500/10 border-${feature.color}-500/20`
                                } border hover:bg-${feature.color}-500/20 transition-all group`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => goToFeature(index)}
                              >
                                <div className={`text-${feature.color}-400 group-hover:text-${feature.color}-300`}>
                                  {feature.icon}
                                </div>
                                <span className={`text-${feature.color}-200 text-sm font-medium`}>
                                  {feature.title}
                                </span>
                              </motion.button>
                            ))}
                          </div>

                          {/* Feature Stats */}
                          <div className="grid grid-cols-2 gap-4 mt-8">
                            {FEATURES[currentFeature].stats.map((stat, index) => (
                              <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 * index }}
                                className="bg-white/5 rounded-xl p-4"
                              >
                                <div className={`text-2xl font-bold text-${FEATURES[currentFeature].color}-400`}>
                                  {stat.value}
                                </div>
                                <div className="text-sm text-gray-400">{stat.label}</div>
                              </motion.div>
                            ))}
                          </div>
                        </div>

                        {/* Feature Preview */}
                        <div className="relative">
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="relative rounded-xl overflow-hidden shadow-2xl"
                          >
                            <img
                              src={FEATURES[currentFeature].image}
                              alt={FEATURES[currentFeature].title}
                              className="w-full h-auto"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                          </motion.div>

                          {/* Floating Elements */}
                          {FEATURES[currentFeature].floatingElements.map((element, index) => (
                            <motion.div
                              key={element.text}
                              className={`absolute ${
                                element.position === 'top-right' ? '-top-4 -right-4' : '-bottom-4 -left-4'
                              } bg-${element.color}-500/20 backdrop-blur-xl rounded-xl p-4 border border-${element.color}-500/30 shadow-xl`}
                              initial={{ opacity: 0, y: element.position === 'top-right' ? -20 : 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.3 + index * 0.1 }}
                            >
                              <div className="flex items-center gap-2">
                                {element.icon}
                                <span className={`text-sm text-${element.color}-200`}>{element.text}</span>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  {/* Navigation Arrows */}
                  <div className="absolute top-1/2 -translate-y-1/2 -left-4">
                    <motion.button
                      className="p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={prevFeature}
                    >
                      <ChevronLeft className="w-6 h-6 text-white" />
                    </motion.button>
                  </div>
                  <div className="absolute top-1/2 -translate-y-1/2 -right-4">
                    <motion.button
                      className="p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={nextFeature}
                    >
                      <ChevronRight className="w-6 h-6 text-white" />
                    </motion.button>
                  </div>

                  {/* Progress Indicators */}
                  <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex gap-2">
                    {FEATURES.map((_, index) => (
                      <motion.button
                        key={index}
                        className={`w-2 h-2 rounded-full transition-all ${
                          currentFeature === index ? 'w-8 bg-blue-500' : 'bg-white/20'
                        }`}
                        onClick={() => goToFeature(index)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="relative py-32 bg-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="grid md:grid-cols-3 gap-8"
            >
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
                  icon: <Download className="w-6 h-6 text-pink-400" />,
                  title: "Easy Export",
                  description: "Download subtitles in SRT format for use anywhere.",
                  color: "pink"
                }
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  whileHover={{ y: -5 }}
                  className="backdrop-blur-lg bg-white/5 rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all group"
                >
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-${feature.color}-500/10 mb-6 group-hover:scale-110 transition-transform`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-white">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-32 bg-black">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20" />
          </div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
              Join thousands of content creators who trust SubtleAI for their subtitle generation needs.
            </p>
            <Link to="/register">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all group">
                  Start Generating Subtitles
                  <Sparkles className="w-5 h-5 ml-2 group-hover:animate-pulse" />
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </section>
      </main>

      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes tilt {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(0.5deg); }
          75% { transform: rotate(-0.5deg); }
        }
        .animate-tilt {
          animation: tilt 10s infinite linear;
        }
      `}</style>
    </div>
  );
}