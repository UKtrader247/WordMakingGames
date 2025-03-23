import React from 'react';
import { X, Mail, MessageSquare, ExternalLink, Globe } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm animate-fadeIn" onClick={onClose}>
      <div 
        className="bg-white dark:bg-gray-800 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-t-2xl"></div>
          
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 text-white transition-all duration-200 z-10"
            aria-label="Close contact dialog"
          >
            <X className="h-5 w-5" />
          </button>
          
          <div className="relative pt-28 px-6 pb-6">
            <div className="w-20 h-20 bg-teal-100 rounded-xl mx-auto -mt-10 flex items-center justify-center shadow-lg border-4 border-white">
              <MessageSquare className="h-10 w-10 text-teal-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-center mt-4 mb-6 text-gray-800 dark:text-white">Contact Us</h2>
            
            <div className="prose dark:prose-invert mx-auto">
              <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">
                Have questions, suggestions, or just want to say hello? We'd love to hear from you!
              </p>
              
              <div className="space-y-5">
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 p-5 rounded-lg flex items-start gap-4">
                  <Mail className="h-6 w-6 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-emerald-700 dark:text-emerald-300 mb-2">Email Us</h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-3">
                      You can reach us anytime at:
                    </p>
                    <a 
                      href="mailto:contact@uniqevo.co.uk" 
                      className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                    >
                      📧 contact@uniqevo.co.uk
                      <ExternalLink className="h-4 w-4 ml-1" />
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 text-center">
                <p className="text-gray-700 dark:text-gray-300">
                  Whether it's feedback, game ideas, or any general inquiries, feel free to drop us an email. We'll get back to you as soon as we can.
                </p>
                <p className="mt-4 text-gray-700 dark:text-gray-300 font-medium">
                  Thanks for visiting WordMakingGames.com — where learning meets fun!
                </p>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-center">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                © {new Date().getFullYear()} Word Making Games | Unique Evolutions Limited
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactModal; 