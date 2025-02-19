import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export function PrivacyPolicyPage() {
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
            Privacy Policy
          </h1>
          <div className="prose prose-invert prose-lg max-w-none bg-gray-800/50 backdrop-blur-xl p-8 shadow-xl border border-white/10 rounded-xl">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-100 mb-4">1. Information We Collect</h2>
              <p className="text-gray-300 mb-4">
                We collect information that you provide directly to us when you:
              </p>
              <ul className="list-disc pl-6 text-gray-300 space-y-2">
                <li>Create an account or use our subtitle generation services</li>
                <li>Communicate with our team</li>
                <li>Upload videos for subtitle generation</li>
                <li>Provide payment information</li>
                <li>Share any other information voluntarily</li>
              </ul>
              <p className="text-gray-300 mt-4">
                This may include your name, email address, video content, generated subtitles, and any other information you choose to provide.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-100 mb-4">2. How We Use Your Information</h2>
              <p className="text-gray-300 mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 text-gray-300 space-y-2">
                <li>Provide, maintain, and improve our subtitle generation services</li>
                <li>Communicate with you about our services</li>
                <li>Develop new features and products</li>
                <li>Protect the security and integrity of our platform</li>
                <li>Process your transactions</li>
                <li>Analyze and enhance our service delivery</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-100 mb-4">3. Information Sharing</h2>
              <p className="text-gray-300">
                We are committed to protecting your privacy. We do not sell your personal information or video content. We may share your information with trusted third-party service providers who assist us in operating our platform, conducting our business, or serving our users. These service providers have access to your information only to perform specific tasks on our behalf and are obligated to protect your information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-100 mb-4">4. Data Security</h2>
              <p className="text-gray-300">
                We implement appropriate technical and organizational security measures to protect your personal information and video content. This includes encryption, secure servers, and regular security assessments. However, please note that no method of transmission over the Internet or electronic storage is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-100 mb-4">5. Your Rights</h2>
              <p className="text-gray-300 mb-4">
                You have several rights regarding your personal information:
              </p>
              <ul className="list-disc pl-6 text-gray-300 space-y-2">
                <li>Access your personal information</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Restrict or object to certain processing activities</li>
                <li>Export your data in a portable format</li>
              </ul>
              <p className="text-gray-300 mt-4">
                To exercise these rights, please contact us using the information provided in the Contact Us section.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-100 mb-4">6. Changes to This Policy</h2>
              <p className="text-gray-300">
                We may update this privacy policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the updated privacy policy on this page and updating the effective date. Your continued use of SubtleAI's services after such modifications constitutes your acknowledgment of the modified policy and agreement to abide by it.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-100 mb-4">7. Contact Us</h2>
              <p className="text-gray-300 mb-4">
                If you have any questions, concerns, or requests related to this privacy policy or our data practices, please contact us at:
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