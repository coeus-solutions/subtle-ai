import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, Zap, Globe, ChevronLeft, ChevronRight, 
  Play, Video, Presentation, Share2, Download,
  Languages, Subtitles, PlayCircle, ArrowRight, CheckCircle2,
  Clock, Twitter, Github, Linkedin, Youtube, Shield, Cpu, 
  FileCheck, Building2, Users, Star, MessageSquare, Award, Palette, Type
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const SUPPORTED_LANGUAGES = [
  "English", "Spanish", "French", "German", "Japanese", "Russian", "Italian", "Chinese", "Turkish", "Korean", "Portuguese"
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
        text: "10+ Languages",
        position: "bottom-left",
        color: "purple"
      }
    ]
  },
  {
    id: 2,
    icon: <Palette className="w-8 h-8 text-purple-400" />,
    title: "Custom Subtitle Styles",
    description: "Personalize your subtitles with custom fonts, sizes, colors, and effects. Preview changes in real-time for perfect results.",
    image: "/screenshots/custom-subtitles-styles.png",
    color: "purple",
    stats: [
      { label: "Style Options", value: "6+" },
      { label: "Font Sizes", value: "Scalable Sizes" },
      { label: "Positions", value: "Flexible" },
      { label: "Effects", value: "Multiple" }
    ],
    floatingElements: [
      {
        icon: <Type className="w-4 h-4 text-purple-400" />,
        text: "Custom Styles",
        position: "top-right",
        color: "purple"
      },
      {
        icon: <Palette className="w-4 h-4 text-blue-400" />,
        text: "Live Preview",
        position: "bottom-left",
        color: "blue"
      }
    ]
  },
  {
    id: 3,
    icon: <Languages className="w-8 h-8 text-purple-400" />,
    title: "Multiple Languages",
    description: "Generate subtitles and AI-powered dubbed audio in multiple languages instantly. Perfect for reaching a global audience with your content.",
    image: "/screenshots/target-language.png",
    color: "purple",
    stats: [
      { label: "Languages", value: "10+" },
      { label: "Translation Time", value: "Instant" },
      { label: "Accuracy", value: "98%" },
      { label: "Audio Dubbing", value: "Included" }
    ],
    floatingElements: [
      {
        icon: <Globe className="w-4 h-4 text-purple-400" />,
        text: "Global Reach",
        position: "top-right",
        color: "purple"
      },
      {
        icon: <Subtitles className="w-4 h-4 text-blue-400" />,
        text: "AI Dubbing",
        position: "bottom-left",
        color: "blue"
      }
    ]
  },
  {
    id: 4,
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
    id: 5,
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
    title: "Style Customization",
    description: "Personalize your subtitles with custom fonts, colors, sizes, and effects for a professional look",
    icon: Palette,
    image: "/screenshots/custom-subtitles-styles"
  },
  {
    title: "Multiple Languages",
    description: "Generate subtitles and AI-dubbed audio in English, Spanish, French, German, Japanese, Russian, Italian, Chinese, Turkish, Korean, and Portuguese",
    icon: Globe,
    image: "/screenshots/target-language.png"
  },
  {
    title: "Quick Processing",
    description: "Fast and accurate subtitle generation and audio dubbing powered by advanced AI",
    icon: Zap,
    image: "/screenshots/full-dashboard-page.png"
  },
  {
    title: "Usage Tracking",
    description: "Monitor your subtitle generation and dubbing usage in real-time",
    icon: Clock,
    image: "/screenshots/billing-n-usage.png"
  }
];

const benefits = [
  "Custom subtitle styles & effects",
  "Font size and color options",
  "Real-time style preview",
  "Multiple language support",
  "AI-powered audio dubbing",
  "Accurate subtitle generation",
  "Easy subtitle downloads",
  "Simple video management",
  "Usage analytics",
  "Fast processing times",
  "Secure file handling"
];

const PRICING_TIERS = [
  {
    name: "Free",
    description: "Perfect for trying out our platform",
    price: "0",
    unit: "forever",
    features: [
      "30 minutes included monthly",
      "All languages supported",
      "Basic subtitle styles",
      "Real-time preview & export",
      "Additional minutes at $1.25/min",
      "7-day video storage"
    ],
    cta: "Get Started Free",
    popular: false,
    gradient: "from-gray-500/20 via-gray-400/10 to-gray-600/5"
  },
  {
    name: "Starter",
    description: "Perfect for individual content creators",
    price: "180",
    unit: "per month",
    features: [
      "120 minutes included monthly",
      "All languages supported",
      "Custom subtitle styles & effects",
      "Real-time preview & advanced export",
      "Additional minutes at $1.25/min",
      "30-day video storage"
    ],
    cta: "Start Free Trial",
    popular: false,
    gradient: "from-blue-500/20 via-blue-400/10 to-blue-600/5"
  },
  {
    name: "Professional",
    description: "Ideal for professional content creators",
    price: "310",
    unit: "per month",
    features: [
      "250 minutes included monthly",
      "Priority support & API access",
      "Custom subtitle styles & effects",
      "Team collaboration features",
      "Additional minutes at $1.25/min",
      "90-day video storage"
    ],
    cta: "Start Pro Trial",
    popular: true,
    gradient: "from-purple-500/20 via-pink-500/10 to-blue-500/20"
  },
  {
    name: "Business",
    description: "For businesses with high-volume needs",
    price: "550",
    unit: "per month",
    features: [
      "480 minutes included monthly",
      "Dedicated support & custom integrations",
      "Custom subtitle styles & effects",
      "Advanced team management",
      "Additional minutes at $1.25/min",
      "Unlimited video storage"
    ],
    cta: "Start Business Trial",
    popular: false,
    gradient: "from-blue-600/20 via-purple-600/10 to-pink-600/20"
  }
];

const TESTIMONIALS = [
  {
    name: "Sarah Chen",
    role: "Content Creator",
    company: "TechReviews",
    image: "/testimonials/sarah.jpg",
    quote: "SubtleAI has revolutionized my workflow. What used to take hours now takes minutes, and the accuracy is incredible.",
    rating: 5
  },
  {
    name: "Marcus Rodriguez",
    role: "Production Manager",
    company: "StreamMedia",
    image: "/testimonials/marcus.jpg",
    quote: "The multi-language support and real-time preview have made our international content distribution so much easier.",
    rating: 5
  },
  {
    name: "Emma Thompson",
    role: "Educational Director",
    company: "EduTech Solutions",
    image: "/testimonials/emma.jpg",
    quote: "We've seen a 40% reduction in post-production time since switching to SubtleAI. The accuracy and ease of use are unmatched.",
    rating: 5
  }
];

const PROCESS_STEPS = [
  {
    icon: <Video className="w-8 h-8 text-blue-400" />,
    title: "Upload Your Video",
    description: "Simply drag and drop your video file or paste a URL. We support all major video and audio formats.",
    mockup: (
      <div className="relative w-full aspect-video bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-white/10">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full max-w-md">
            <div className="border-2 border-dashed border-blue-500/30 rounded-xl p-8 flex flex-col items-center justify-center bg-blue-500/5">
              <Video className="w-12 h-12 text-blue-400 mb-4 animate-pulse" />
              <p className="text-blue-300 text-center">Drag and drop your video here or click to browse</p>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    icon: <Palette className="w-8 h-8 text-blue-400" />,
    title: "Customize Style",
    description: "Personalize your subtitles with custom fonts, sizes, colors, and effects. Preview changes in real-time before processing.",
    mockup: (
      <div className="relative w-full aspect-video bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-white/10">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full max-w-md space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Type className="w-5 h-5 text-blue-400" />
                <span className="text-blue-200">Style Options</span>
              </div>
              <div className="flex gap-2">
                <Button size="sm" className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300">
                  <Type className="w-4 h-4 mr-2" />
                  Font Size
                </Button>
                <Button size="sm" className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-300">
                  <Palette className="w-4 h-4 mr-2" />
                  Colors
                </Button>
              </div>
            </div>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <div className="space-y-2">
                  <div className="h-2 bg-blue-400/20 rounded-full w-3/4" />
                  <div className="h-2 bg-blue-400/20 rounded-full w-1/2" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="h-8 rounded bg-purple-500/20 border border-purple-500/30" />
                <div className="h-8 rounded bg-blue-500/20 border border-blue-500/30" />
                <div className="h-8 rounded bg-pink-500/20 border border-pink-500/30" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    icon: <Cpu className="w-8 h-8 text-purple-400" />,
    title: "AI Processing",
    description: "Our advanced AI analyzes your video to generate accurate subtitles and create natural-sounding dubbed audio.",
    mockup: (
      <div className="relative w-full aspect-video bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-white/10">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full max-w-md space-y-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Subtitles className="w-5 h-5 text-purple-400" />
                <span className="text-purple-200 text-sm">Generating Subtitles</span>
              </div>
              <CheckCircle2 className="w-5 h-5 text-green-400" />
            </div>
            <div className="h-2 bg-purple-500/20 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-purple-500"
                initial={{ width: "0%" }}
                animate={{ width: "75%" }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Languages className="w-5 h-5 text-purple-400" />
                <span className="text-purple-200 text-sm">Creating Dubbed Audio</span>
              </div>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Cpu className="w-5 h-5 text-purple-400" />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    icon: <Languages className="w-8 h-8 text-pink-400" />,
    title: "Choose Languages",
    description: "Select from multiple languages for instant translation and AI dubbing of your content. Each language comes with subtitles and natural voice dubbing.",
    mockup: (
      <div className="relative w-full aspect-video bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-white/10">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full max-w-md">
            <div className="grid grid-cols-3 gap-3">
              {SUPPORTED_LANGUAGES.map((lang, index) => (
                <motion.div
                  key={lang}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-pink-500/10 border border-pink-500/20 rounded-lg p-3 flex items-center gap-2.5"
                >
                  <Languages className="w-5 h-5 text-pink-400" />
                  <span className="text-pink-200 text-sm font-medium">{lang}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    icon: <FileCheck className="w-8 h-8 text-emerald-400" />,
    title: "Review & Export",
    description: "Preview both subtitled and dubbed versions, then export your video with perfect synchronization in any supported language.",
    mockup: (
      <div className="relative w-full aspect-video bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-white/10">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full max-w-md space-y-4">
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-emerald-400" />
                  <span className="text-emerald-200">Ready to Export</span>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300">
                    <Subtitles className="w-4 h-4 mr-2" />
                    Subtitled
                  </Button>
                  <Button size="sm" className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300">
                    <Languages className="w-4 h-4 mr-2" />
                    Dubbed
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-2 bg-emerald-500/20 rounded-full w-full" />
                <div className="h-2 bg-emerald-500/20 rounded-full w-3/4" />
                <div className="h-2 bg-emerald-500/20 rounded-full w-1/2" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
];

const TRUST_LOGOS = [
  { name: "TechCorp", logo: "/logos/techcorp.svg" },
  { name: "MediaPro", logo: "/logos/mediapro.svg" },
  { name: "EduTech", logo: "/logos/edutech.svg" },
  { name: "StreamNet", logo: "/logos/streamnet.svg" },
  { name: "ContentFlow", logo: "/logos/contentflow.svg" }
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
            <button
              onClick={() => {
                const pricingSection = document.getElementById('pricing-section');
                if (pricingSection) {
                  pricingSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="text-gray-300 hover:text-white transition-colors font-medium"
            >
              Pricing
            </button>
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
                  With AI Dubbing & Styled Subtitles
                </span>
              </motion.h1>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="relative"
              >
                <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
                  Instantly generate professional subtitles and dubbed audio in{' '}
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
                  <br />
                  with customizable styles using our advanced AI.
                </p>
                <div className="flex flex-wrap gap-4 justify-center items-center mt-8 mb-12">
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
                    <Type className="w-5 h-5 text-blue-400" />
                    <span className="text-sm text-gray-300">Custom Styles</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
                    <Languages className="w-5 h-5 text-purple-400" />
                    <span className="text-sm text-gray-300">AI Dubbing</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
                    <Sparkles className="w-5 h-5 text-pink-400" />
                    <span className="text-sm text-gray-300">Real-time Preview</span>
                  </div>
                </div>
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
                <motion.div
                  className="flex flex-col items-center sm:items-start gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <motion.p 
                    className="text-gray-400 font-medium flex items-center gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    <span className="w-2 h-2 rounded-full bg-green-400"></span>
                    Start with 30 free minutes • No credit card required
                  </motion.p>
                  <motion.div
                    className="flex items-center gap-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9 }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex items-baseline">
                        <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                          $1.25
                        </span>
                        <span className="text-gray-400 text-sm font-medium">/minute</span>
                      </div>
                    </div>
                    <span className="text-gray-500">•</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-semibold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                        Pay as you go
                      </span>
                      <motion.div
                        initial={{ opacity: 0.5 }}
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-purple-400 to-pink-400"
                      />
                    </div>
                  </motion.div>
                </motion.div>
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
                              } bg-${element.color}-500/30 backdrop-blur-xl rounded-xl p-4 border border-${element.color}-500/40 shadow-lg shadow-${element.color}-500/20 z-10`}
                              initial={{ opacity: 0, y: element.position === 'top-right' ? -20 : 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.3 + index * 0.1 }}
                            >
                              <div className="flex items-center gap-2">
                                {element.icon}
                                <span className={`text-sm font-medium text-${element.color}-200`}>{element.text}</span>
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

        {/* How It Works Section */}
        <section className="relative py-24 bg-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                How It Works
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Generate professional subtitles in four simple steps
              </p>
            </div>

            <div className="space-y-24">
              {PROCESS_STEPS.map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="relative"
                >
                  <div className="grid md:grid-cols-2 gap-12 items-center">
                    {/* Content */}
                    <div className={`space-y-6 ${index % 2 === 1 ? 'md:order-2' : ''}`}>
                      <div className="flex items-center gap-4">
                        <div className={`flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-${step.icon.props.className.match(/text-(\w+)-/)[1]}-500/20 to-${step.icon.props.className.match(/text-(\w+)-/)[1]}-500/5 border border-${step.icon.props.className.match(/text-(\w+)-/)[1]}-500/20`}>
                          {step.icon}
                        </div>
                        <span className="text-sm font-medium text-gray-400">Step {index + 1}</span>
                      </div>
                      <h3 className="text-2xl font-bold text-white">{step.title}</h3>
                      <p className="text-gray-400 text-lg leading-relaxed">{step.description}</p>
                    </div>

                    {/* Mockup */}
                    <div className={index % 2 === 1 ? 'md:order-1' : ''}>
                      {step.mockup}
                    </div>
                  </div>

                  {/* Connector Line */}
                  {index < PROCESS_STEPS.length - 1 && (
                    <div className="hidden md:block absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-full w-px h-16 bg-gradient-to-b from-blue-500/50 to-transparent" />
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust & Social Proof Section */}
        <section className="relative py-24 bg-black">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute w-full h-full">
              <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
              <div className="absolute top-3/4 -right-1/4 w-96 h-96 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
            </div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Trusted by Industry Leaders
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Join thousands of content creators and businesses who trust SubtleAI
              </p>
            </div>

            {/* Trust Metrics */}
            <div className="grid md:grid-cols-4 gap-8 mb-16">
              {[
                { icon: <Users />, metric: "10,000+", label: "Active Users" },
                { icon: <Clock />, metric: "1M+", label: "Minutes Processed" },
                { icon: <MessageSquare />, metric: "99.9%", label: "Accuracy Rate" },
                { icon: <Award />, metric: "24/7", label: "Support" }
              ].map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10 text-center"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-500/10 mb-4">
                    {item.icon}
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">{item.metric}</div>
                  <div className="text-gray-400">{item.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Testimonials */}
            <div className="grid md:grid-cols-3 gap-8">
              {TESTIMONIALS.map((testimonial, index) => (
                <motion.div
                  key={testimonial.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-semibold text-white">{testimonial.name}</div>
                      <div className="text-sm text-gray-400">{testimonial.role} at {testimonial.company}</div>
                    </div>
                  </div>
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-300 italic">"{testimonial.quote}"</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced Pricing Section */}
        <section className="relative py-24 bg-black" id="pricing-section">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute w-full h-full">
              <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
              <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
              <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />
            </div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Simple, Transparent Pricing
                </h2>
                <p className="text-gray-400 max-w-2xl mx-auto">
                  Choose the plan that best fits your needs. No hidden fees.
                </p>
              </motion.div>
            </div>

            {/* Paid Tiers */}
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {PRICING_TIERS.slice(1).map((tier, index) => (
                <motion.div
                  key={tier.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  whileHover={{ translateY: -8 }}
                  className={cn(
                    "relative bg-gradient-to-br backdrop-blur-xl rounded-xl p-8 border transition-all duration-300",
                    tier.gradient,
                    tier.popular
                      ? "border-purple-500/50 shadow-lg shadow-purple-500/20"
                      : "border-white/10 hover:border-white/20"
                  )}
                >
                  {tier.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-full text-sm font-medium shadow-lg">
                      Most Popular
                    </div>
                  )}

                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-white mb-2">{tier.name}</h3>
                    <p className="text-gray-300 text-sm">{tier.description}</p>
                  </div>

                  <div className="mb-8">
                    <div className="flex items-baseline">
                      <span className="text-2xl font-bold text-white">$</span>
                      <span className="text-4xl font-bold text-white">{tier.price}</span>
                      <span className="ml-2 text-gray-300">/{tier.unit}</span>
                    </div>
                  </div>

                  <ul className="mb-8 space-y-4">
                    {tier.features.map((feature) => (
                      <motion.li
                        key={feature}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="flex items-center gap-2 text-gray-200"
                      >
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-r from-purple-500/30 to-blue-500/30 flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4 text-white" />
                        </div>
                        {feature}
                      </motion.li>
                    ))}
                  </ul>

                  <Button 
                    className={cn(
                      "w-full transition-all duration-300",
                      tier.popular
                        ? "bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-500 hover:via-pink-500 hover:to-blue-500 shadow-lg hover:shadow-purple-500/25"
                        : "bg-white/10 hover:bg-white/20"
                    )}
                    onClick={() => window.location.href = '/register'}
                  >
                    {tier.cta}
                  </Button>
                </motion.div>
              ))}
            </div>

            {/* Enterprise Contact - Enhanced */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-20 text-center"
            >
              <div className="inline-block bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
                <h3 className="text-xl font-semibold mb-4">Need a Custom Solution?</h3>
                <p className="text-gray-300 mb-8 max-w-2xl">
                  Contact our sales team for custom pricing and features tailored to your organization's needs.
                </p>
                <a 
                  href="mailto:ashaheen+subtleai@workhub.ai"
                  className="inline-flex items-center px-4 py-2 rounded-lg border border-white/20 hover:border-white/40 hover:bg-white/5 text-white transition-all duration-200 group"
                >
                  <Building2 className="w-5 h-5 mr-2 group-hover:text-purple-400 transition-colors" />
                  Contact Enterprise Sales
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-24 bg-black">
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
              Ready to Go Global?
            </h2>
            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
              Transform your content with AI-powered subtitles and natural voice dubbing in multiple languages. Reach a global audience effortlessly.
            </p>
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