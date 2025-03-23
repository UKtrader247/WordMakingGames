import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { topics } from '../data/topics';
import { Gamepad2, Search, Trophy, CheckCircle, X } from 'lucide-react';
import VisitCounter from '../components/VisitCounter';
import AboutModal from "../components/AboutModal";
import PrivacyModal from "../components/PrivacyModal";
import ContactModal from "../components/ContactModal";
import StatsCard from '../components/StatsCard';

function HomePage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [completedTopics, setCompletedTopics] = useState<string[]>([]);
  const [forceUpdate, setForceUpdate] = useState(0);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error' | 'info'} | null>(null);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

  // Toast message display function
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Load completed topics from localStorage on component mount and periodically check for updates
  useEffect(() => {
    const loadCompletedTopics = () => {
      try {
        const storedTopics = localStorage.getItem('completedTopics');
        if (storedTopics) {
          const parsed = JSON.parse(storedTopics);
          console.log('Loaded completed topics:', parsed);
          setCompletedTopics(parsed);
        }
      } catch (error) {
        console.error('Error loading completed topics:', error);
        // If there's an error, clear the potentially corrupted data
        localStorage.removeItem('completedTopics');
      }
    };

    // Load initially
    loadCompletedTopics();
    
    // Set up an interval to check for localStorage changes
    const checkInterval = setInterval(() => {
      const storedTopics = localStorage.getItem('completedTopics');
      if (storedTopics) {
        try {
          const parsed = JSON.parse(storedTopics);
          // Only update if different
          if (JSON.stringify(parsed) !== JSON.stringify(completedTopics)) {
            console.log('Detected localStorage change, updating completed topics');
            setCompletedTopics(parsed);
          }
        } catch (e) {
          console.error('Error checking localStorage:', e);
        }
      }
    }, 1000); // Check every second

    // Listen for custom event from GamePage when a quiz is completed
    const handleQuizComplete = (event: CustomEvent) => {
      const topicId = event.detail.topicId;
      console.log('Quiz completed event received for topic:', topicId);
      
      if (topicId) {
        // Use a callback to ensure we're working with the most current state
        setCompletedTopics(prevTopics => {
          if (!prevTopics.includes(topicId)) {
            const updatedTopics = [...prevTopics, topicId];
            console.log('Updating completed topics to:', updatedTopics);
            localStorage.setItem('completedTopics', JSON.stringify(updatedTopics));
            
            // Show toast for automatically completed topic
            const completedTopic = topics.find(t => t.id === topicId)?.name || topicId;
            showToast(`Congratulations! You've completed the ${completedTopic} topic!`, 'success');
            
            return updatedTopics;
          }
          return prevTopics;
        });
        // Force a re-render
        setForceUpdate(prev => prev + 1);
      }
    };

    window.addEventListener('quizCompleted', handleQuizComplete as EventListener);

    return () => {
      window.removeEventListener('quizCompleted', handleQuizComplete as EventListener);
      clearInterval(checkInterval);
    };
  }, [completedTopics]); // Re-add the dependency to detect changes

  // Add a function to debug the contents of localStorage
  const debugLocalStorage = () => {
    const storedTopics = localStorage.getItem('completedTopics');
    console.log('Current localStorage contents:', storedTopics);
    if (storedTopics) {
      try {
        const parsed = JSON.parse(storedTopics);
        console.log('Parsed completed topics:', parsed);
      } catch (e) {
        console.error('Error parsing localStorage:', e);
      }
    }
  };

  // Debug localStorage on page load
  useEffect(() => {
    debugLocalStorage();
  }, []);

  // Filter and sort topics based on search term
  const filteredTopics = useMemo(() => {
    if (!searchTerm.trim()) return topics;

    const lowerSearchTerm = searchTerm.toLowerCase();
    
    return topics
      .filter(topic => 
        topic.name.toLowerCase().includes(lowerSearchTerm) || 
        topic.description.toLowerCase().includes(lowerSearchTerm)
      )
      .sort((a, b) => {
        // Prioritize topics where the search term is in the name
        const aNameMatch = a.name.toLowerCase().includes(lowerSearchTerm);
        const bNameMatch = b.name.toLowerCase().includes(lowerSearchTerm);
        
        if (aNameMatch && !bNameMatch) return -1;
        if (!aNameMatch && bNameMatch) return 1;
        
        // Then sort by how close to the beginning the match is
        const aNameIndex = a.name.toLowerCase().indexOf(lowerSearchTerm);
        const bNameIndex = b.name.toLowerCase().indexOf(lowerSearchTerm);
        
        if (aNameIndex !== -1 && bNameIndex !== -1) return aNameIndex - bNameIndex;
        
        // By default, sort alphabetically
        return a.name.localeCompare(b.name);
      });
  }, [searchTerm]);

  // For testing - add function to mark a topic as completed
  const markTopicAsCompleted = (topicId: string) => {
    setCompletedTopics(prevTopics => {
      if (!prevTopics.includes(topicId)) {
        const updatedTopics = [...prevTopics, topicId];
        localStorage.setItem('completedTopics', JSON.stringify(updatedTopics));
        console.log('Manually marked as completed:', topicId);
        debugLocalStorage();
        
        // Show toast for manually marked topic
        const completedTopic = topics.find(t => t.id === topicId)?.name || topicId;
        showToast(`${completedTopic} topic marked as completed!`, 'success');
        
        return updatedTopics;
      }
      
      // Already completed
      const completedTopic = topics.find(t => t.id === topicId)?.name || topicId;
      showToast(`${completedTopic} topic was already completed.`, 'info');
      
      return prevTopics;
    });
    // Force a re-render
    setForceUpdate(prev => prev + 1);
  };

  // For testing - clear all completed topics
  const clearCompletedTopics = () => {
    setCompletedTopics([]);
    localStorage.removeItem('completedTopics');
    console.log('Cleared all completed topics');
    debugLocalStorage();
    // Force a re-render
    setForceUpdate(prev => prev + 1);
    
    // Show toast
    showToast('Progress has been reset. All completion data cleared.', 'error');
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 p-4 md:p-8 pt-12 md:pt-16">
        <div className="max-w-6xl mx-auto">
          <header className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-blue-600 flex items-center justify-center gap-3" 
                style={{ animation: 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}>
              <Gamepad2 className="h-10 w-10" /> Word Making Games
            </h1>
            <p className="mt-4 text-gray-600 text-lg">
              Choose a topic and start playing to improve your vocabulary and spelling skills!
            </p>
            <div className="mt-4 flex justify-center items-center gap-4 flex-wrap">
              <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full flex items-center">
                <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
                <span>{completedTopics.length} / {topics.length} topics completed</span>
                {completedTopics.length > 0 && (
                  <>
                    <span className="mx-2">•</span>
                    <span className="text-green-600">
                      Latest: {topics.find(t => t.id === completedTopics[completedTopics.length - 1])?.name || 'Unknown'}
                    </span>
                  </>
                )}
              </div>
              
              <button 
                onClick={() => navigate('/play/sportscars')}
                className="bg-blue-500 text-white px-6 py-2 rounded-full flex items-center gap-2 hover:bg-blue-600 transition-all duration-200"
              >
                <span>🏎️</span>
                <span className="font-semibold">New Quiz!</span>
                <span>•</span>
                <span>Sports Cars</span>
              </button>
            </div>
          </header>

          <main>
            <section aria-labelledby="topic-section">
              <div className="relative mb-8 max-w-md mx-auto">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-blue-500" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-12 py-3 border-2 border-blue-300 rounded-full leading-5 bg-white 
                    placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 
                    focus:border-blue-400 transition-all duration-200 shadow-sm hover:shadow-md text-gray-700"
                  placeholder="Search topics..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  aria-label="Search topics"
                />
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-blue-500"
                    aria-label="Clear search"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>

              <div className="mb-6 flex flex-wrap justify-center gap-2">
                <button 
                  onClick={() => setSearchTerm('')}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${!searchTerm ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  All Topics
                </button>
                <button 
                  onClick={() => setSearchTerm('nature')}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${searchTerm === 'nature' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  Nature & Science
                </button>
                <button 
                  onClick={() => setSearchTerm('art')}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${searchTerm === 'art' ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  Arts & Culture
                </button>
                <button 
                  onClick={() => setSearchTerm('technology')}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${searchTerm === 'technology' ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  Technology
                </button>
                <button 
                  onClick={() => setSearchTerm('travel')}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${searchTerm === 'travel' ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  World & Travel
                </button>
              </div>

              <h2 className="sr-only" id="topic-section">Game Topics</h2>
              
              {filteredTopics.length === 0 ? (
                <p className="text-center text-gray-500 my-16 text-lg">
                  No topics found matching "<span className="font-semibold text-blue-600">{searchTerm}</span>". Try a different search term.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6 lg:gap-8">
                  {filteredTopics.map((topic) => {
                    // Check if this topic is in the completed list
                    const isCompleted = completedTopics.includes(topic.id);
                    console.log(`Topic ${topic.id} completed:`, isCompleted, 'Current completedTopics:', completedTopics);
                    
                    return (
                      <article 
                        key={topic.id}
                        className={`
                          ${isCompleted ? 'bg-green-100 border-green-500' : 'bg-white border-transparent hover:border-blue-300'} 
                          rounded-xl p-5 md:p-6 
                          shadow-md hover:shadow-xl transform hover:-translate-y-2 
                          transition-all duration-300 ease-in-out border-2
                        `}
                        data-completed={isCompleted ? "true" : "false"}
                        data-topic-id={topic.id}
                      >
                        <button
                          onClick={() => navigate(`/play/${topic.id}`)}
                          className="w-full h-full text-left group relative overflow-hidden"
                          aria-label={`Play ${topic.name} word games`}
                        >
                          {isCompleted && (
                            <div className="absolute -top-1 -right-1 w-16 h-16 overflow-hidden">
                              <div className="absolute top-0 right-0 transform rotate-45 translate-y-2 -translate-x-2 w-8 h-8 text-white bg-green-500 flex items-center justify-center">
                                <Trophy className="h-4 w-4" aria-label="Completed" />
                              </div>
                            </div>
                          )}
                          <div className="flex items-start justify-between mb-4">
                            <span className="text-5xl" role="img" aria-label={topic.name + " icon"}>{topic.icon}</span>
                            <span className={`${isCompleted ? 'bg-green-200 text-green-800' : 'bg-blue-100 text-blue-800'} px-3 py-1 rounded-full text-sm font-medium inline-flex items-center`}>
                              {topic.words.length} words
                            </span>
                          </div>
                          <h3 className={`text-xl font-bold ${isCompleted ? 'text-green-800' : 'text-gray-800'} mb-2 group-hover:text-blue-600`}>
                            {topic.name}
                          </h3>
                          <p className="text-gray-600 text-sm">
                            {topic.description}
                          </p>
                        </button>
                      </article>
                    );
                  })}
                </div>
              )}

              {/* Admin/Debug buttons - remove in production */}
              <div className="mt-10 flex justify-center gap-4 flex-wrap">
                <button 
                  onClick={() => clearCompletedTopics()}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                >
                  Reset Progress
                </button>
                <button
                  onClick={() => {
                    // Show toast first, then refresh after a small delay
                    showToast('Page is refreshing...', 'info');
                    setTimeout(() => {
                      window.location.reload();
                    }, 500);
                  }}
                  className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 text-sm"
                >
                  Refresh Page
                </button>
                <button
                  onClick={() => {
                    debugLocalStorage();
                    // Force re-render and update localStorage timestamp to trigger the interval checker
                    setForceUpdate(prev => prev + 1);
                    localStorage.setItem('lastRefresh', Date.now().toString());
                    showToast('Storage debugged and UI refreshed', 'info');
                  }}
                  className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
                >
                  Debug Storage & Refresh
                </button>
              </div>
            </section>
          </main>

          <footer className="mt-12 text-center">
            <div className="bg-white p-6 rounded-xl shadow-md max-w-4xl mx-auto">
              <p className="font-medium text-blue-800">&copy; {new Date().getFullYear()} Word Making Games</p>
              <p className="mt-2 text-gray-600 text-sm">
                Improve your vocabulary with our educational word games. Choose from {topics.length} topics and over {topics.reduce((sum, topic) => sum + topic.words.length, 0)} words!
              </p>
              <div className="mt-4 flex justify-center space-x-4">
                <button 
                  onClick={() => setShowAboutModal(true)}
                  className="text-blue-500 hover:text-blue-700 transition"
                >
                  About
                </button>
                <button
                  onClick={() => setShowPrivacyModal(true)}
                  className="text-blue-500 hover:text-blue-700 transition"
                >
                  Privacy
                </button>
                <button
                  onClick={() => setShowContactModal(true)}
                  className="text-blue-500 hover:text-blue-700 transition"
                >
                  Contact
                </button>
              </div>
            </div>
          </footer>
        </div>
        
        {/* Toast notification */}
        {toast && (
          <div 
            className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 transition-all duration-300 ease-in-out animate-fade-in
              ${toast.type === 'success' ? 'bg-green-500 text-white' : 
                toast.type === 'error' ? 'bg-red-500 text-white' : 
                'bg-blue-500 text-white'}`}
            role="alert"
          >
            {toast.type === 'success' ? (
              <CheckCircle className="h-5 w-5" />
            ) : toast.type === 'error' ? (
              <X className="h-5 w-5" />
            ) : (
              <span className="h-5 w-5 flex items-center justify-center font-bold">i</span>
            )}
            <span>{toast.message}</span>
            <button 
              onClick={() => setToast(null)} 
              className="ml-2 opacity-70 hover:opacity-100"
              aria-label="Close notification"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
        
        <VisitCounter />
      </div>
      
      {/* Modals */}
      <AboutModal isOpen={showAboutModal} onClose={() => setShowAboutModal(false)} />
      <PrivacyModal isOpen={showPrivacyModal} onClose={() => setShowPrivacyModal(false)} />
      <ContactModal isOpen={showContactModal} onClose={() => setShowContactModal(false)} />
    </>
  );
}

export default HomePage;