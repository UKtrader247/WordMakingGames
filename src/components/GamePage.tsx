import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, RotateCcw, AlertCircle, Home, Lightbulb, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useParams, useNavigate } from 'react-router-dom';
import { topics } from '../data/topics';
import VisitCounter from './VisitCounter';

interface Letter {
  id: string;
  char: string;
  position: { x: number; y: number };
}

interface DropZone {
  id: string;
  letter: string | null;
  isPrefilled?: boolean;
}

function GamePage() {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const topic = topics.find(t => t.id === topicId);

  const [currentWordData, setCurrentWordData] = useState(topic?.words[0]);
  const [letters, setLetters] = useState<Letter[]>([]);
  const [dropZones, setDropZones] = useState<DropZone[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [score, setScore] = useState(0);
  const [showScoreAnimation, setShowScoreAnimation] = useState(false);
  const [completedWords, setCompletedWords] = useState<Set<string>>(new Set());
  const [usedSolve, setUsedSolve] = useState(false);

  // Add new state for touch handling
  const [touchedLetter, setTouchedLetter] = useState<Letter | null>(null);
  const gameAreaRef = useRef<HTMLDivElement>(null);

  // Add this new state
  const [showCelebration, setShowCelebration] = useState(false);

  const getRandomWord = () => {
    if (!topic) return null;
    const availableWords = topic.words.filter(word => !completedWords.has(word.word));
    if (availableWords.length === 0) {
      return topic.words[Math.floor(Math.random() * topic.words.length)];
    }
    return availableWords[Math.floor(Math.random() * availableWords.length)];
  };

  const triggerConfetti = () => {
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      zIndex: 1000,
    };

    function fire(particleRatio: number, opts: any) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });

    fire(0.2, {
      spread: 60,
    });

    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  };

  const initializeGame = () => {
    const newWordData = getRandomWord();
    if (!newWordData) return;

    setCurrentWordData(newWordData);
    setShowError(false);
    setSuccess(false);
    setUsedSolve(false);

    // Initialize drop zones
    const wordLength = newWordData.word.length;
    
    // Determine how many letters to pre-fill - never more than 3
    let numToFill = 0;
    if (wordLength >= 5) {
      // For 5 letters fill 2, for 6+ letters fill exactly 3
      numToFill = Math.min(wordLength === 5 ? 2 : 3, 3);
    }
    
    // Generate random positions to fill
    const fillPositions: number[] = [];
    while (fillPositions.length < numToFill) {
      const randomPos = Math.floor(Math.random() * wordLength);
      if (!fillPositions.includes(randomPos)) {
        fillPositions.push(randomPos);
      }
    }
    
    // Set up dropzones with the pre-filled letters
    const initialDropZones = newWordData.word.split('').map((letter, index) => {
      const shouldPreFill = fillPositions.includes(index);
      return {
        id: `dropzone-${index}`,
        letter: shouldPreFill ? letter : null,
        isPrefilled: shouldPreFill
      };
    });
    
    setDropZones(initialDropZones);

    // Combine target word and extra letters, but only include letters that aren't pre-filled
    const preFilledLetters = initialDropZones
      .filter(zone => zone.letter !== null)
      .map(zone => zone.letter as string);
    
    const remainingWordLetters = newWordData.word
      .split('')
      .filter(letter => !preFilledLetters.includes(letter) || 
                        // If letter appears multiple times, only exclude it once
                        preFilledLetters.indexOf(letter) !== preFilledLetters.lastIndexOf(letter));
    
    const allLetters = (remainingWordLetters.join('') + newWordData.extraLetters).split('');

    // Create scattered letters with better distribution
    const shuffledLetters = allLetters
      .sort(() => Math.random() - 0.5)
      .map((char, index) => {
        const gridSize = Math.ceil(Math.sqrt(allLetters.length));
        const row = Math.floor(index / gridSize);
        const col = index % gridSize;

        const xBase = (col / gridSize) * 80 + 10; // Add padding of 10% on each side
        const yBase = (row / gridSize) * 80 + 10;

        return {
          id: `letter-${index}`,
          char,
          position: {
            x: xBase + (Math.random() * 10 - 5), // Smaller random offset
            y: yBase + (Math.random() * 10 - 5)
          }
        };
      });
    setLetters(shuffledLetters);
  };

  useEffect(() => {
    if (!topic) {
      navigate('/');
      return;
    }
    initializeGame();
  }, [topicId]);

  const handleDragStart = (e: React.DragEvent, letterId: string) => {
    e.dataTransfer.setData('text/plain', letterId);
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const checkWord = (dropZones: DropZone[]) => {
    const currentWord = dropZones.map(zone => zone.letter).join('');
    if (currentWord.length === currentWordData?.word.length) {
      if (currentWord === currentWordData?.word) {
        setSuccess(true);
        setShowError(false);
        setScore(prevScore => prevScore + 10);
        setShowScoreAnimation(true);
        setTimeout(() => setShowScoreAnimation(false), 1500);
        
        // Add word to completed words
        const newCompletedWords = new Set([...completedWords, currentWordData.word]);
        setCompletedWords(newCompletedWords);
        
        // Check if all words in the topic are completed
        if (newCompletedWords.size === topic?.words.length) {
          // Show trophy celebration
          setShowCelebration(true);
          
          // All words completed, emit completion event
          const event = new CustomEvent('quizCompleted', { 
            detail: { topicId: topic.id } 
          });
          window.dispatchEvent(event);
        }
        
        triggerConfetti();
      } else {
        setShowError(true);
        const dropZoneElements = document.querySelectorAll('.drop-zone');
        dropZoneElements.forEach(element => {
          element.classList.add('shake');
          setTimeout(() => element.classList.remove('shake'), 500);
        });
      }
    }
  };

  const handleDrop = (e: React.DragEvent, dropZoneId: string) => {
    e.preventDefault();
    const letterId = e.dataTransfer.getData('text/plain');
    const letter = letters.find(l => l.id === letterId);

    if (!letter) return;

    const dropZoneIndex = dropZones.findIndex(zone => zone.id === dropZoneId);
    if (dropZoneIndex === -1) return;
    
    // Don't allow dropping on pre-filled letters
    if (dropZones[dropZoneIndex].isPrefilled) return;

    const updatedDropZones = [...dropZones];
    updatedDropZones[dropZoneIndex] = { ...updatedDropZones[dropZoneIndex], letter: letter.char };
    setDropZones(updatedDropZones);

    setLetters(letters.filter(l => l.id !== letterId));
    checkWord(updatedDropZones);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const resetGame = () => {
    initializeGame();
  };

  const handleSolveClick = () => {
    if (!currentWordData) return;

    // Create drop zones with the correct word letters
    const solvedDropZones = currentWordData.word.split('').map((letter, index) => ({
      id: `dropzone-${index}`,
      letter
    }));

    setDropZones(solvedDropZones);
    setLetters([]); // Remove all draggable letters
    setUsedSolve(true);

    // Show success animation after a short delay
    setTimeout(() => {
      setSuccess(true);
      setShowError(false);
      
      // Add word to completed words
      const newCompletedWords = new Set([...completedWords, currentWordData.word]);
      setCompletedWords(newCompletedWords);
      
      // Check if all words in the topic are completed
      if (newCompletedWords.size === topic?.words.length) {
        // Show trophy celebration
        setShowCelebration(true);
        
        // All words completed, emit completion event
        const event = new CustomEvent('quizCompleted', { 
          detail: { topicId: topic.id } 
        });
        window.dispatchEvent(event);
      }
      
      triggerConfetti();
      setScore(prevScore => prevScore + 5); // Award half points for using solve
      setShowScoreAnimation(true);
      setTimeout(() => setShowScoreAnimation(false), 1500);
    }, 500);
  };

  const resetCurrentWord = () => {
    if (!currentWordData) return;

    // Reset success and error states
    setShowError(false);
    setSuccess(false);
    setUsedSolve(false);

    // Reset drop zones to empty or pre-filled based on word length
    const wordLength = currentWordData.word.length;
    
    // Determine how many letters to pre-fill - never more than 3
    let numToFill = 0;
    if (wordLength >= 5) {
      // For 5 letters fill 2, for 6+ letters fill exactly 3
      numToFill = Math.min(wordLength === 5 ? 2 : 3, 3);
    }
    
    // Generate random positions to fill
    const fillPositions: number[] = [];
    while (fillPositions.length < numToFill) {
      const randomPos = Math.floor(Math.random() * wordLength);
      if (!fillPositions.includes(randomPos)) {
        fillPositions.push(randomPos);
      }
    }
    
    // Set up dropzones with the pre-filled letters
    const initialDropZones = currentWordData.word.split('').map((letter, index) => {
      const shouldPreFill = fillPositions.includes(index);
      return {
        id: `dropzone-${index}`,
        letter: shouldPreFill ? letter : null,
        isPrefilled: shouldPreFill
      };
    });
    
    setDropZones(initialDropZones);

    // Recreate remaining letters (both from word and extra letters)
    const preFilledLetters = initialDropZones
      .filter(zone => zone.letter !== null)
      .map(zone => zone.letter as string);
    
    const remainingWordLetters = currentWordData.word
      .split('')
      .filter(letter => !preFilledLetters.includes(letter) || 
                        // If letter appears multiple times, only exclude it once
                        preFilledLetters.indexOf(letter) !== preFilledLetters.lastIndexOf(letter));
    
    const allLetters = (remainingWordLetters.join('') + currentWordData.extraLetters).split('');

    // Create scattered letters with distribution
    const shuffledLetters = allLetters
      .sort(() => Math.random() - 0.5)
      .map((char, index) => {
        const gridSize = Math.ceil(Math.sqrt(allLetters.length));
        const row = Math.floor(index / gridSize);
        const col = index % gridSize;

        const xBase = (col / gridSize) * 80 + 10;
        const yBase = (row / gridSize) * 80 + 10;

        return {
          id: `letter-${index}`,
          char,
          position: {
            x: xBase + (Math.random() * 10 - 5),
            y: yBase + (Math.random() * 10 - 5)
          }
        };
      });
    setLetters(shuffledLetters);
  };

  // Add new functions for touch handling
  const handleTouchStart = (e: React.TouchEvent, letter: Letter) => {
    e.preventDefault();
    setTouchedLetter(letter);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchedLetter || !gameAreaRef.current) return;

    // Prevent scrolling while dragging
    e.preventDefault();

    // Get the touch position relative to the game area
    const touch = e.touches[0];
    const gameArea = gameAreaRef.current.getBoundingClientRect();

    // Create a "ghost" element showing the letter being dragged
    const ghostElement = document.getElementById('touch-ghost');
    if (ghostElement) {
      ghostElement.style.left = `${touch.clientX - gameArea.left - 25}px`;
      ghostElement.style.top = `${touch.clientY - gameArea.top - 25}px`;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchedLetter || !gameAreaRef.current) {
      setIsDragging(false);
      setTouchedLetter(null);
      return;
    }

    // Find which dropzone is under the touch point
    const touch = e.changedTouches[0];
    const dropzoneElements = document.querySelectorAll('.drop-zone');
    const gameArea = gameAreaRef.current.getBoundingClientRect();

    let targetDropzone: Element | null = null;

    dropzoneElements.forEach((element) => {
      const rect = element.getBoundingClientRect();
      if (
        touch.clientX >= rect.left &&
        touch.clientX <= rect.right &&
        touch.clientY >= rect.top &&
        touch.clientY <= rect.bottom
      ) {
        targetDropzone = element;
      }
    });

    if (targetDropzone) {
      const dropZoneId = targetDropzone.getAttribute('data-id');
      if (dropZoneId) {
        // Find the dropzone index
        const dropZoneIndex = dropZones.findIndex(zone => zone.id === dropZoneId);
        if (dropZoneIndex !== -1) {
          // Don't allow placing letters on pre-filled positions
          if (dropZones[dropZoneIndex].isPrefilled) {
            setIsDragging(false);
            setTouchedLetter(null);
            return;
          }

          // Update dropzones with the letter
          const updatedDropZones = [...dropZones];
          updatedDropZones[dropZoneIndex] = { ...updatedDropZones[dropZoneIndex], letter: touchedLetter.char };
          setDropZones(updatedDropZones);

          // Remove the letter from available letters
          setLetters(letters.filter(l => l.id !== touchedLetter.id));

          // Check if the word is complete
          checkWord(updatedDropZones);
        }
      }
    }

    setIsDragging(false);
    setTouchedLetter(null);
  };

  // Trophy celebration component
  const CompletionCelebration = ({ onClose }: { onClose: () => void }) => {
    useEffect(() => {
      // Auto-close the celebration after 5 seconds
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      
      return () => clearTimeout(timer);
    }, [onClose]);

    // Handle redirect to home page
    const handleContinue = () => {
      onClose();
      navigate('/');
    };

    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70">
        <div className="bg-white rounded-lg p-8 max-w-md text-center animate-bounce-slow">
          <div className="text-6xl mb-4">🏆</div>
          <h2 className="text-2xl font-bold mb-2 text-yellow-600">Congratulations!</h2>
          <p className="text-gray-700 mb-6">You've completed all the words in this topic!</p>
          <button 
            onClick={handleContinue}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8 pt-16">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12 relative">
          <button
            onClick={() => navigate('/')}
            className="absolute left-0 top-0 flex items-center gap-2 px-3 py-1 sm:px-4 sm:py-2 bg-white/80 text-blue-600 
              rounded-lg hover:bg-white transition-colors duration-200 shadow-sm text-sm sm:text-base"
            aria-label="Return to home page"
          >
            <Home className="w-4 h-4" aria-hidden="true" />
            <span className="hidden sm:inline">Back to Home</span>
            <span className="sm:hidden">Home</span>
          </button>
          <h1 className="text-3xl sm:text-4xl font-bold text-blue-800 mb-4">
            {topic?.name || 'Word Making Game'}
          </h1>
          <div className="flex items-center justify-center gap-8 mb-4">
            <p className="text-gray-600">Drag the letters to form the word</p>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Score:</span>
              <span className={`text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent
                ${showScoreAnimation ? 'animate-bounce' : ''}`}
                aria-live="polite"
              >
                {score}
              </span>
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            Words Completed: <span aria-live="polite">{completedWords.size}</span> / {topic?.words.length || 0}
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-4">
            <span className="px-2 py-1 bg-gray-100 rounded">
              Current Word Length: {currentWordData?.word.length || 0}
            </span>
          </div>
          {currentWordData && currentWordData.word.length >= 5 && (
            <div className="text-sm text-gray-500 mb-4">
              <span className="px-2 py-1 bg-blue-50 rounded border border-blue-200">
                <span className="text-blue-700 font-semibold">Hint:</span> Some letters have been pre-filled to help you
              </span>
            </div>
          )}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
            <button
              onClick={resetGame}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg 
                hover:bg-blue-700 transition-colors duration-200 w-full sm:w-auto text-sm sm:text-base mb-2 sm:mb-0"
              aria-label="Get next word"
            >
              <RotateCcw className="w-4 h-4" aria-hidden="true" />
              Next Word
            </button>

            <button
              onClick={resetCurrentWord}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg 
                hover:bg-gray-700 transition-colors duration-200 w-full sm:w-auto text-sm sm:text-base mb-2 sm:mb-0"
              disabled={success}
              aria-label="Try again with the same word"
            >
              <RefreshCw className="w-4 h-4" aria-hidden="true" />
              Try Again
            </button>

            <button
              onClick={handleSolveClick}
              className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg 
                hover:bg-amber-600 transition-colors duration-200 w-full sm:w-auto text-sm sm:text-base"
              disabled={success || usedSolve}
              aria-label="Solve the current word automatically"
            >
              <Lightbulb className="w-4 h-4" aria-hidden="true" />
              Solve
            </button>
          </div>
        </header>

        <main>
          {showError && (
            <div className="flex items-center justify-center gap-2 text-red-600 mb-6 animate-bounce"
              aria-live="assertive" role="alert">
              <AlertCircle className="w-5 h-5" aria-hidden="true" />
              <p>Incorrect word! Try again.</p>
            </div>
          )}

          <section aria-label="Word puzzle game area" ref={gameAreaRef}>
            <div className="flex flex-wrap justify-center gap-3 mb-8 sm:mb-16" aria-label="Drop zones for letters">
              {dropZones.map((zone) => (
                <div
                  key={zone.id}
                  data-id={zone.id}
                  onDrop={(e) => handleDrop(e, zone.id)}
                  onDragOver={handleDragOver}
                  className={`drop-zone w-12 h-12 sm:w-16 sm:h-16 border-2 
                    ${zone.letter 
                      ? zone.isPrefilled 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-green-500 bg-green-50' 
                      : 'border-dashed border-gray-400'
                    } rounded-lg flex items-center justify-center transition-all`}
                >
                  {zone.letter && (
                    <span className={`text-xl sm:text-2xl font-bold ${zone.isPrefilled ? 'text-blue-700' : 'text-green-700'}`}>
                      {zone.letter}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Touch dragging ghost element */}
            {isDragging && touchedLetter && (
              <div
                id="touch-ghost"
                className="fixed w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center shadow-lg z-50 pointer-events-none"
                style={{ left: '0', top: '0' }}
              >
                <span className="text-lg sm:text-xl font-bold text-blue-700">{touchedLetter.char}</span>
              </div>
            )}

            <div className="relative w-full h-[250px] sm:h-[300px] bg-white/50 rounded-xl p-4">
              {letters.map((letter) => (
                <div
                  key={letter.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, letter.id)}
                  onDragEnd={handleDragEnd}
                  onTouchStart={(e) => handleTouchStart(e, letter)}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  style={{
                    position: 'absolute',
                    left: `${letter.position.x}%`,
                    top: `${letter.position.y}%`,
                    transform: `rotate(${Math.random() * 20 - 10}deg)`,
                    cursor: 'grab'
                  }}
                  className={`w-10 h-10 sm:w-12 sm:h-12 bg-white shadow-lg rounded-lg flex items-center justify-center
                    ${isDragging ? 'opacity-50' : 'opacity-100'}
                    active:scale-125 hover:scale-125 hover:shadow-xl hover:z-10 hover:bg-blue-50 hover:rotate-0
                    transition-all duration-300 ease-in-out touch-manipulation`}
                >
                  <span className="text-lg sm:text-xl font-bold text-blue-700">{letter.char}</span>
                </div>
              ))}
            </div>
          </section>

          <div className="fixed bottom-0 left-0 right-0 z-10 bg-white/90 p-2 text-center text-xs text-gray-500 md:hidden">
            Tap and drag letters to the boxes above
          </div>
        </main>

        <div className="text-center mt-6 mb-8 p-4 bg-white/80 rounded-lg shadow-sm">
          <p className="text-gray-600">
            <span className="font-semibold">Hint:</span> {currentWordData?.hint}
          </p>
        </div>

        {success && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-xl text-center">
              <Sparkles className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-green-700 mb-4">
                Congratulations!
              </h2>
              <p className="text-gray-600 mb-2">You successfully formed the word!</p>
              <p className="text-xl font-bold mb-6">
                <span className="text-gray-600">Score: </span>
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  {score}
                </span>
              </p>
              <div className="space-y-2">
                <p className="text-sm text-gray-500">
                  Words Completed: {completedWords.size} / {topic?.words.length || 0}
                </p>
                <button
                  onClick={resetGame}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700
                    transition-colors duration-200"
                >
                  Next Word
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Trophy celebration */}
        {showCelebration && (
          <CompletionCelebration onClose={() => setShowCelebration(false)} />
        )}
      </div>
      <VisitCounter />
    </div>
  );
}

export default GamePage;