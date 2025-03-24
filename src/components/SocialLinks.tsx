import React, { useState, useEffect } from 'react';
import { Facebook, Twitter, Share2, Linkedin } from 'lucide-react';

const SocialLinks: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");

  // Website info for sharing
  const websiteTitle = "Word Making Games";
  const websiteDescription = "Engaging word making games to improve vocabulary, spelling, and language skills through fun interactive puzzles.";
  const websiteUrl = "https://wordmakinggames.com/";

  // Set current URL on component mount
  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  // Generate sharing URLs using the current URL
  const shareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(websiteUrl)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(websiteUrl)}&text=${encodeURIComponent(websiteDescription)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(websiteUrl)}`,
    pinterest: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(websiteUrl)}&description=${encodeURIComponent(websiteDescription)}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(websiteDescription + " " + websiteUrl)}`,
    email: `mailto:?subject=${encodeURIComponent(websiteTitle)}&body=${encodeURIComponent(websiteDescription + "\n\n" + websiteUrl)}`
  };

  // Function to handle email sharing
  const handleEmailShare = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.location.href = shareUrls.email;
  };

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
          href={shareUrls.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center text-white shadow-lg hover:scale-110 transition-all"
          aria-label="Share on Facebook"
          onClick={(e) => {
            e.preventDefault();
            window.open(shareUrls.facebook, 'facebook-share', 'width=580,height=296');
          }}
        >
          <Facebook size={20} />
        </a>
        <a
          href={shareUrls.twitter}
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 rounded-full bg-sky-500 hover:bg-sky-600 flex items-center justify-center text-white shadow-lg hover:scale-110 transition-all"
          aria-label="Share on Twitter"
          onClick={(e) => {
            e.preventDefault();
            window.open(shareUrls.twitter, 'twitter-share', 'width=550,height=235');
          }}
        >
          <Twitter size={20} />
        </a>
        <a
          href={shareUrls.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center text-white shadow-lg hover:scale-110 transition-all"
          aria-label="Share on WhatsApp"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.101-.473-.15-.673.15-.2.301-.777.966-.951 1.166-.173.201-.347.223-.648.075-.303-.15-1.267-.467-2.416-1.483-.896-.795-1.497-1.777-1.673-2.078-.175-.302-.019-.465.132-.613.136-.132.3-.347.45-.52.151-.174.202-.3.303-.5.099-.2.05-.375-.025-.524-.075-.15-.673-1.62-.922-2.206-.242-.576-.486-.499-.673-.505-.174-.008-.379-.009-.579-.009-.201 0-.527.074-.8.375-.272.3-1.04 1.016-1.04 2.479s1.065 2.876 1.213 3.074c.15.198 2.096 3.2 5.077 4.489.71.305 1.263.489 1.694.629.712.227 1.36.194 1.871.118.571-.084 1.758-.719 2.006-1.413.247-.695.247-1.29.173-1.413-.074-.124-.273-.198-.574-.349z" />
            <path d="M12 2C6.478 2 2 6.478 2 12c0 1.503.334 2.926.931 4.206L2 22l5.794-.93A9.972 9.972 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.497 0-2.935-.393-4.208-1.109l-.302-.165-3.124.814.83-3.03-.172-.304A7.964 7.964 0 0 1 4 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" />
          </svg>
        </a>
        <a
          href={shareUrls.pinterest}
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center text-white shadow-lg hover:scale-110 transition-all"
          aria-label="Share on Pinterest"
          onClick={(e) => {
            e.preventDefault();
            window.open(shareUrls.pinterest, 'pinterest-share', 'width=750,height=550');
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a10 10 0 0 0-3.16 19.5c-.07-.7-.15-1.87.03-2.67.17-.74 1.13-4.68 1.13-4.68s-.3-.57-.3-1.4c0-1.33.77-2.32 1.73-2.32.82 0 1.2.61 1.2 1.33 0 .82-.52 2.03-.79 3.16-.23.96.48 1.73 1.42 1.73 1.7 0 3.01-1.78 3.01-4.35 0-2.27-1.63-3.87-3.97-3.87-2.7 0-4.28 2.03-4.28 4.13 0 .82.31 1.7.7 2.17.07.1.08.18.06.27-.07.27-.2.85-.23.97-.04.15-.13.2-.28.12-1.04-.49-1.7-2.03-1.7-3.27 0-2.68 1.95-5.13 5.61-5.13 2.94 0 5.22 2.1 5.22 4.9 0 2.93-1.84 5.29-4.39 5.29-.86 0-1.66-.45-1.94-.98l-.52 1.98c-.19.73-.71 1.65-1.06 2.21A10 10 0 1 0 12 2z" />
          </svg>
        </a>
        <a
          href={shareUrls.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 rounded-full bg-blue-700 hover:bg-blue-800 flex items-center justify-center text-white shadow-lg hover:scale-110 transition-all"
          aria-label="Share on LinkedIn"
          onClick={(e) => {
            e.preventDefault();
            window.open(shareUrls.linkedin, 'linkedin-share', 'width=750,height=600');
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
            <rect x="2" y="9" width="4" height="12" />
            <circle cx="4" cy="4" r="2" />
          </svg>
        </a>
        <a
          href={shareUrls.email}
          className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-900 flex items-center justify-center text-white shadow-lg hover:scale-110 transition-all"
          aria-label="Share via Email"
          onClick={handleEmailShare}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
        </a>
      </div>
    </>
  );
};

export default SocialLinks; 