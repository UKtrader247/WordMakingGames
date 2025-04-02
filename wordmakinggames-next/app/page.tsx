'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, Trophy, Brain, Sparkles } from 'lucide-react';
import AboutModal from './components/AboutModal';
import PrivacyModal from './components/PrivacyModal';
import ContactModal from './components/ContactModal';

export default function Home() {
  const router = useRouter();
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Word Making Games</h1>
            </div>
            <nav className="flex space-x-4">
              <button
                onClick={() => setIsAboutOpen(true)}
                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              >
                About
              </button>
              <button
                onClick={() => setIsPrivacyOpen(true)}
                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              >
                Privacy
              </button>
              <button
                onClick={() => setIsContactOpen(true)}
                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              >
                Contact
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome to Word Making Games
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Test your knowledge and have fun with our word quizzes!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Game Cards */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center space-x-3 mb-4">
              <Trophy className="h-6 w-6 text-yellow-500" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Word Quizzes</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Test your knowledge with our fun word quizzes. Challenge yourself and learn new words!
            </p>
            <button
              onClick={() => router.push('/game')}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start Quiz
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center space-x-3 mb-4">
              <Brain className="h-6 w-6 text-purple-500" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Word Puzzles</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Solve challenging word puzzles and improve your vocabulary skills.
            </p>
            <button
              onClick={() => router.push('/puzzle')}
              className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Start Puzzle
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center space-x-3 mb-4">
              <Sparkles className="h-6 w-6 text-pink-500" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Daily Challenges</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Take on daily word challenges and compete with yourself to improve.
            </p>
            <button
              onClick={() => router.push('/daily')}
              className="w-full bg-pink-600 text-white py-2 px-4 rounded-lg hover:bg-pink-700 transition-colors"
            >
              Start Challenge
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <p className="text-gray-600 dark:text-gray-300">
              © {new Date().getFullYear()} Word Making Games
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => setIsAboutOpen(true)}
                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              >
                About
              </button>
              <button
                onClick={() => setIsPrivacyOpen(true)}
                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              >
                Privacy
              </button>
              <button
                onClick={() => setIsContactOpen(true)}
                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              >
                Contact
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
      <PrivacyModal isOpen={isPrivacyOpen} onClose={() => setIsPrivacyOpen(false)} />
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </div>
  );
} 