import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 text-white">
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
            <Link to="/">
              <div className="flex items-center">
                <img
                  src="/favicon.svg"
                  alt="SubtleAI Logo"
                  className="w-8 h-8 mr-2"
                />
                <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                  SubtleAI
                </span>
              </div>
            </Link>
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

      <main className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Terms of Service
          </h1>
          <div className="prose prose-invert prose-lg max-w-none bg-gray-800/50 backdrop-blur-xl p-8 shadow-xl border border-white/10 rounded-xl">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-100 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-300">
                By accessing and using SubtleAI's website and subtitle generation services, you expressly acknowledge and agree to be bound by these Terms of Service. If you do not agree to these terms, please refrain from using our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-100 mb-4">2. Use License</h2>
              <p className="text-gray-300">
                SubtleAI grants you a limited, non-exclusive, non-transferable license to access and use our subtitle generation services for your purposes in accordance with these terms. This license is strictly for your use of SubtleAI's services and does not extend to any commercial redistribution or unauthorized modifications of our platform.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-100 mb-4">3. Disclaimer</h2>
              <p className="text-gray-300">
                The services and materials on SubtleAI's platform are provided on an 'as is' and 'as available' basis. SubtleAI makes no representations or warranties of any kind, express or implied, regarding the operation of our services or the information, content, materials, or products included in our platform. To the fullest extent permissible by law, we disclaim all warranties, including but not limited to implied warranties of merchantability, fitness for a particular purpose, and non-infringement of intellectual property or other proprietary rights.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-100 mb-4">4. Limitations of Liability</h2>
              <p className="text-gray-300">
                To the maximum extent permitted by applicable law, SubtleAI and its affiliates, officers, directors, employees, agents, and suppliers shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of (or inability to access or use) our subtitle generation services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-100 mb-4">5. Privacy Policy</h2>
              <p className="text-gray-300">
                Your privacy is important to us. The use of SubtleAI's services is governed by our Privacy Policy, which outlines how we collect, use, and protect your personal information. By using our services, you consent to the data practices described in our Privacy Policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-100 mb-4">6. Governing Law</h2>
              <p className="text-gray-300">
                These Terms of Service and any separate agreements shall be governed by and construed in accordance with the laws of the State of Texas, United States. You agree to submit to the exclusive jurisdiction of the courts located in Texas for the resolution of any disputes arising from or relating to these terms or your use of our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-100 mb-4">7. Contact Information</h2>
              <p className="text-gray-300 mb-4">
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <address className="text-gray-300 not-italic">
                1606 Headway Cir<br />
                STE 9810<br />
                Austin, TX 78754<br />
                United States
              </address>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
} 