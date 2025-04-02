import React from 'react';
import { X, Shield, Lock, ExternalLink } from 'lucide-react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm animate-fadeIn" onClick={onClose}>
      <div 
        className="bg-white dark:bg-gray-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-t-2xl"></div>
          
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 text-white transition-all duration-200 z-10"
            aria-label="Close privacy dialog"
          >
            <X className="h-5 w-5" />
          </button>
          
          <div className="relative pt-28 px-6 pb-6">
            <div className="w-20 h-20 bg-purple-100 rounded-xl mx-auto -mt-10 flex items-center justify-center shadow-lg border-4 border-white">
              <Lock className="h-10 w-10 text-purple-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-center mt-4 mb-2 text-gray-800 dark:text-white">Privacy Policy</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">Effective Date: March 2025</p>
            
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-gray-600 dark:text-gray-300 mb-5">
                Welcome to WordMakingGames.com – a fun and educational project by <a href="https://www.linkedin.com/in/sarder-iftekhar/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 hover:underline">Sarder Iftekhar</a>. We value your privacy and want to be transparent about how we handle your information.
              </p>
              
              <div className="space-y-5">
                <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-indigo-700 dark:text-indigo-300 flex items-center gap-2 mb-2">
                    <span className="inline-block w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-800 text-indigo-700 dark:text-indigo-300 flex items-center justify-center text-sm font-bold">1</span>
                    No Personal Data Collection
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    We do not collect, store, or share any personal data from our users. You can enjoy playing word games and quizzes on our website without providing any personal information.
                  </p>
                </div>
                
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-purple-700 dark:text-purple-300 flex items-center gap-2 mb-2">
                    <span className="inline-block w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-800 text-purple-700 dark:text-purple-300 flex items-center justify-center text-sm font-bold">2</span>
                    No User Accounts or Registrations
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    There's no need to create an account or sign up to access our games. Our website is strictly for fun and educational purposes.
                  </p>
                </div>
                
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-300 flex items-center gap-2 mb-2">
                    <span className="inline-block w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300 flex items-center justify-center text-sm font-bold">3</span>
                    No Cookies or Tracking
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    We do not use cookies or any tracking tools to monitor your activity. Your visit here is private, and nothing is stored.
                  </p>
                </div>
                
                <div className="bg-pink-50 dark:bg-pink-900/20 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-pink-700 dark:text-pink-300 flex items-center gap-2 mb-2">
                    <span className="inline-block w-6 h-6 rounded-full bg-pink-100 dark:bg-pink-800 text-pink-700 dark:text-pink-300 flex items-center justify-center text-sm font-bold">4</span>
                    Third-Party Links
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    Our website may contain links to other educational or informational sites. We are not responsible for the privacy practices or content of those external sites.
                  </p>
                </div>
                
                <div className="bg-violet-50 dark:bg-violet-900/20 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-violet-700 dark:text-violet-300 flex items-center gap-2 mb-2">
                    <span className="inline-block w-6 h-6 rounded-full bg-violet-100 dark:bg-violet-800 text-violet-700 dark:text-violet-300 flex items-center justify-center text-sm font-bold">5</span>
                    Changes to This Policy
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated effective date.
                  </p>
                </div>
                
                <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-emerald-700 dark:text-emerald-300 flex items-center gap-2 mb-2">
                    <span className="inline-block w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-800 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-sm font-bold">6</span>
                    Contact Us
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    If you have any questions or concerns about this Privacy Policy, feel free to reach out to us at: 
                    <a href="mailto:sarder2008@gmail.com" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 ml-1 inline-flex items-center">
                      sarder2008@gmail.com
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-between">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                © {new Date().getFullYear()} Word Making Games
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-purple-500" />
                <span className="text-sm text-gray-600 dark:text-gray-300">Your Privacy Matters</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyModal; 