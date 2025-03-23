import React, { useEffect, useState } from 'react';

interface StatsCardProps {
  className?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ className = '' }) => {
  const [completedWords, setCompletedWords] = useState<number>(0);
  const [totalWords, setTotalWords] = useState<number>(0);
  const [currentWordLength, setCurrentWordLength] = useState<number>(0);
  
  useEffect(() => {
    // Get stats from local storage or session storage
    const getStats = () => {
      try {
        // For completed words
        const gameState = localStorage.getItem('gameState');
        if (gameState) {
          const parsedState = JSON.parse(gameState);
          if (parsedState.completedWords) {
            setCompletedWords(Object.keys(parsedState.completedWords).length);
          }
        }
        
        // For current topic
        const currentGame = sessionStorage.getItem('currentGame');
        if (currentGame) {
          const parsedGame = JSON.parse(currentGame);
          if (parsedGame.topic && parsedGame.topic.words) {
            setTotalWords(parsedGame.topic.words.length);
          }
          if (parsedGame.currentWord) {
            setCurrentWordLength(parsedGame.currentWord.length);
          }
        }
      } catch (error) {
        console.error('Error getting stats:', error);
      }
    };
    
    getStats();
    
    // Set up event listener for game state changes
    const handleGameStateChange = () => getStats();
    window.addEventListener('gameStateChanged', handleGameStateChange);
    
    return () => {
      window.removeEventListener('gameStateChanged', handleGameStateChange);
    };
  }, []);
  
  return (
    <div className={`flex items-center justify-center gap-4 text-sm text-gray-500 ${className}`}>
      <span>
        Words Completed: <span aria-live="polite">{completedWords}</span> / {totalWords || 0}
      </span>
      <span className="px-2 py-1 bg-gray-100 rounded">
        Current Word Length: {currentWordLength || 0}
      </span>
    </div>
  );
};

export default StatsCard; 