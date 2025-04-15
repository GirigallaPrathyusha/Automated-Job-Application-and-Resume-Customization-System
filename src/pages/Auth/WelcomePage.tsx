
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-appPurple-light to-white">
      <div className="container mx-auto px-4 py-16">
        <header className="flex justify-between items-center mb-16 animate-fade-in">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2"
          >
            <h1 className="text-2xl font-bold text-gray-800">JobFinder</h1>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex gap-4"
          >
            <Link to="/login">
              <Button variant="outline">Log in</Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-appPurple hover:bg-appSecondary">Sign up</Button>
            </Link>
          </motion.div>
        </header>

        <main className="mt-20">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-5xl font-bold text-gray-800 mb-6"
            >
              Streamline Your Job Search Journey
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl text-gray-600 mb-8"
            >
              Upload once, apply everywhere. Start your career journey today.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Link to="/signup">
                <Button size="lg" className="bg-appPurple hover:bg-appSecondary">
                  Get Started
                </Button>
              </Link>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
