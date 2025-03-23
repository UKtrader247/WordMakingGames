import React, { useState } from 'react';
import { Facebook, Twitter, Instagram, Youtube, Linkedin, Github, Share2 } from 'lucide-react';

const SocialLinks: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      {/* Mobile toggle button */}
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="fixed right-4 top-20 md:hidden z-50 w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center text-white shadow-lg"
        aria-label="Toggle social media links"
      >
        <Share2 size={20} className={`transform transition-transform duration-300 ${isExpanded ? 'rotate-45' : 'rotate-0'}`} />
      </button>

      {/* Desktop - always visible, Mobile - toggleable */}
      <div className={`fixed right-4 top-1/2 transform -translate-y-1/2 flex flex-col gap-3 z-40 transition-all duration-300 ${isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-16 md:opacity-100 md:translate-x-0'}`}>
        <a 
          href="https://facebook.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center text-white shadow-lg hover:scale-110 transition-all"
          aria-label="Visit our Facebook page"
        >
          <Facebook size={20} />
        </a>
        <a 
          href="https://twitter.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-10 h-10 rounded-full bg-sky-500 hover:bg-sky-600 flex items-center justify-center text-white shadow-lg hover:scale-110 transition-all"
          aria-label="Visit our Twitter page"
        >
          <Twitter size={20} />
        </a>
        <a 
          href="https://instagram.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-yellow-500 hover:from-pink-600 hover:via-purple-600 hover:to-yellow-600 flex items-center justify-center text-white shadow-lg hover:scale-110 transition-all"
          aria-label="Visit our Instagram page"
        >
          <Instagram size={20} />
        </a>
        <a 
          href="https://youtube.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-10 h-10 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center text-white shadow-lg hover:scale-110 transition-all"
          aria-label="Visit our YouTube channel"
        >
          <Youtube size={20} />
        </a>
        <a 
          href="https://linkedin.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-10 h-10 rounded-full bg-blue-700 hover:bg-blue-800 flex items-center justify-center text-white shadow-lg hover:scale-110 transition-all"
          aria-label="Visit our LinkedIn page"
        >
          <Linkedin size={20} />
        </a>
        <a 
          href="https://github.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-900 flex items-center justify-center text-white shadow-lg hover:scale-110 transition-all"
          aria-label="Visit our GitHub page"
        >
          <Github size={20} />
        </a>
      </div>
    </>
  );
};

export default SocialLinks; 