import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { topics } from '../data/topics';
import { Gamepad2, Search, Trophy } from 'lucide-react';
import VisitCounter from '../components/VisitCounter';

function HomePage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [completedTopics, setCompletedTopics] = useState<string[]>([]);

  // Load completed topics from localStorage on component mount
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

    loadCompletedTopics();

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
            return updatedTopics;
          }
          return prevTopics;
        });
      }
    };

    window.addEventListener('quizCompleted', handleQuizComplete as EventListener);

    return () => {
      window.removeEventListener('quizCompleted', handleQuizComplete as EventListener);
    };
  }, []); // Remove the dependency on completedTopics to avoid re-registering the event listener

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
        return updatedTopics;
      }
      return prevTopics;
    });
  };

  // For testing - clear all completed topics
  const clearCompletedTopics = () => {
    setCompletedTopics([]);
    localStorage.removeItem('completedTopics');
    console.log('Cleared all completed topics');
    debugLocalStorage();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8 pt-16">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-blue-800 mb-4 flex items-center justify-center gap-3" id="main-heading">
            <Gamepad2 className="w-12 h-12" aria-hidden="true" />
            <span>Word Making Game</span>
          </h1>
          <p className="text-gray-600 text-lg" id="site-description">
            Choose a topic and start playing to improve your vocabulary and spelling skills!
          </p>
          <div className="mt-2 text-sm text-gray-500">
            Completed topics: {completedTopics.length} / {topics.length}
          </div>
        </header>

        <main>
          <section aria-labelledby="topic-section">
            <div className="relative mb-8 max-w-md mx-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white 
                  placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 
                  focus:border-blue-500 sm:text-sm"
                placeholder="Search topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search topics"
              />
            </div>

            <h2 className="sr-only" id="topic-section">Game Topics</h2>
            
            {filteredTopics.length === 0 ? (
              <p className="text-center text-gray-500 my-16">
                No topics found matching "{searchTerm}". Try a different search term.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredTopics.map((topic) => {
                  const isCompleted = completedTopics.includes(topic.id);
                  console.log(`Topic ${topic.id} completed:`, isCompleted);
                  return (
                    <article 
                      key={topic.id}
                      className={`${isCompleted ? 'bg-green-100' : 'bg-white'} rounded-xl p-6 
                        shadow-lg hover:shadow-xl transform hover:-translate-y-1 
                        transition-all duration-200 border-2 ${isCompleted ? 'border-green-500' : 'border-transparent'}`}
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
                          <span className="text-4xl" role="img" aria-label={topic.name + " icon"}>{topic.icon}</span>
                          <span className={`${isCompleted ? 'bg-green-200 text-green-800' : 'bg-blue-100 text-blue-800'} px-2 py-1 rounded-full text-sm font-medium`}>
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
            <div className="mt-10 flex justify-center gap-4">
              <button 
                onClick={() => clearCompletedTopics()}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
              >
                Reset Progress
              </button>
              {searchTerm && (
                <button 
                  onClick={() => filteredTopics.length > 0 && markTopicAsCompleted(filteredTopics[0].id)}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                >
                  Mark First Result as Completed
                </button>
              )}
              <button
                onClick={() => {
                  const colorsTopic = topics.find(t => t.id === "colors");
                  if (colorsTopic) markTopicAsCompleted(colorsTopic.id);
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
              >
                Mark Colors as Completed
              </button>
            </div>
          </section>
        </main>

        <footer className="mt-12 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Word Making Games. All rights reserved.</p>
          <p className="mt-1">Improve your vocabulary with our educational word games</p>
          <p className="mt-1">
            <a href="https://wordmakinggames.com" className="text-blue-600 hover:underline">
              wordmakinggames.com
            </a>
          </p>
        </footer>
      </div>
      <VisitCounter />
    </div>
  );
}

export default HomePage;