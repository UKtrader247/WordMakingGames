'use client';

import React from 'react';
import { X, Heart, BookOpen, Award, Shield } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm animate-fadeIn" onClick={onClose}>
      <div
        className="bg-white dark:bg-gray-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 rounded-t-2xl"></div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 text-white transition-all duration-200 z-10"
            aria-label="Close about dialog"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="relative pt-28 px-6 pb-6">
            <div className="w-20 h-20 bg-blue-100 rounded-xl mx-auto -mt-10 flex items-center justify-center shadow-lg border-4 border-white">
              <BookOpen className="h-10 w-10 text-blue-600" />
            </div>

            <h2 className="text-2xl font-bold text-center mt-4 mb-6 text-gray-800 dark:text-white">About Us</h2>

            <div className="prose dark:prose-invert mx-auto">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Welcome to Word Making Games – your fun and educational stop for word quizzes and puzzles! 🎯
              </p>

              <p className="text-gray-600 dark:text-gray-300 mb-4">
                This website is developed with one simple goal – to help you learn, improve, and enjoy through word games. Whether you're a student, a quiz lover, or just someone who enjoys challenging their brain, you'll find something fun here.
              </p>

              <div className="flex items-start space-x-3 my-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Shield className="h-5 w-5 mt-0.5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  WordMakingGames.com is a project by <a href="https://www.linkedin.com/in/sarder-iftekhar/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 hover:underline">Sarder Iftekhar</a>. It's created purely for educational and entertainment purposes. We don't store any personal data or collect any information from you. There's no sharing, no tracking – just clean fun and learning!
                </p>
              </div>

              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Every quiz here is designed to help boost your vocabulary, improve your knowledge, and sharpen your mind while having a good time.
              </p>

              <div className="text-center mt-6">
                <p className="text-gray-700 dark:text-gray-300 font-medium flex items-center justify-center">
                  Thanks for visiting, and we hope you enjoy playing our games as much as we enjoyed creating them!
                  <Heart className="h-4 w-4 text-pink-500 ml-1 inline" />
                </p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-between">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                © {new Date().getFullYear()} Word Making Games
              </div>
              <div className="flex items-center space-x-2">
                <Award className="h-5 w-5 text-yellow-500" />
                <span className="text-sm text-gray-600 dark:text-gray-300">Educational Excellence</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutModal; 