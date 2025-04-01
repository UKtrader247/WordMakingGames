import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Sparkles, RotateCcw, AlertCircle, Home, Lightbulb, RefreshCw, CheckCircle, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useParams, useNavigate } from 'react-router-dom';
import { topics } from '../data/topics';
import VisitCounter from './VisitCounter';
import { DndContext, DragEndEvent, MouseSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import { AnimatePresence, motion } from "framer-motion";
import AboutModal from './AboutModal';
import PrivacyModal from './PrivacyModal';
import ContactModal from './ContactModal';
import StatsCard from './StatsCard';
import SocialLinks from './SocialLinks';

interface Letter {
  id: string;
  char: string;
  position: { x: number; y: number };
}

interface DropZone {
  id: string;
  letter: string | null;
  isPrefilled?: boolean;
  isIncorrect?: boolean;
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
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  const [progressAnimation, setProgressAnimation] = useState(false);
  const [timerStartTime, setTimerStartTime] = useState(Date.now());
  const [timerText, setTimerText] = useState('00:00:00');

  // Add new state for touch handling
  const [touchedLetter, setTouchedLetter] = useState<Letter | null>(null);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  
  // Timer animation frame reference
  const requestRef = useRef<number>();

  // Add this new state
  const [showCelebration, setShowCelebration] = useState(false);

  // Modals
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

  // Add Reset Confirmation Modal
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Toast message display function
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type: type === 'info' ? 'success' : type });
    setTimeout(() => setToast(null), 3000);
  };

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
        isPrefilled: shouldPreFill,
        isIncorrect: false
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
    
    // Make sure we track if the component is still mounted
    let isMounted = true;
    console.log('GamePage mounting for topic:', topicId);
    
    // First load game state
    const initializeGameFlow = async () => {
      try {
        console.log('Starting initialization flow');
        
        // Check if we have saved state first
        const savedState = localStorage.getItem(`gameState_${topicId}`);
        if (savedState) {
          console.log('Found saved state:', savedState);
          try {
            const parsedState = JSON.parse(savedState);
            
            // Set score first
            if (parsedState.score) {
              console.log('Setting score from saved state:', parsedState.score);
              setScore(parsedState.score);
            }
            
            // Then set completed words
            if (parsedState.completedWords && Array.isArray(parsedState.completedWords)) {
              console.log('Setting completed words from saved state:', parsedState.completedWords.length);
              setCompletedWords(new Set(parsedState.completedWords));
            }
            
            // Finally handle current word if needed
            if (parsedState.currentWord) {
              // Find the word data for the saved word
              const savedWordData = topic.words.find(w => w.word === parsedState.currentWord);
              if (savedWordData) {
                console.log('Resuming saved word:', parsedState.currentWord);
                setCurrentWordData(savedWordData);
                // Short delay to ensure state is set before initializing
                await new Promise(resolve => setTimeout(resolve, 50));
                // Reinitialize the game with the saved word
                initializeGameWithWord(savedWordData);
                return; // Exit early as we've initialized with saved word
              }
            }
          } catch (err) {
            console.error('Error parsing saved state:', err);
          }
        } else {
          console.log('No saved state found for topic:', topicId);
        }
        
        // If we get here, either no saved state or couldn't use saved word
        // Short delay to ensure state updates have propagated
        await new Promise(resolve => setTimeout(resolve, 50));
        
        // Only initialize if still mounted
        if (isMounted) {
          console.log('Initializing new game');
          initializeGame();
        }
      } catch (err) {
        console.error('Error in game initialization:', err);
        // Fallback to initializing a new game
        if (isMounted) initializeGame();
      }
    };
    
    // Start the initialization flow
    initializeGameFlow();
    
    // Save state when component unmounts
    return () => {
      isMounted = false;
      console.log('GamePage unmounting, saving final state');
      // Save game state one last time when leaving
      if (topic && topicId && (completedWords.size > 0 || score > 0)) {
        saveGameState();
      }
    };
  }, [topicId]); // Only run when topicId changes

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
        
        // Immediately save progress to ensure it's not lost on page leave
        saveGameState();
        
        // Trigger progress bar animation
        setProgressAnimation(true);
        setTimeout(() => setProgressAnimation(false), 1000);

        // Check if all words in the topic are completed
        if (newCompletedWords.size === topic?.words.length) {
          // Show trophy celebration
          setShowCelebration(true);

          // All words completed, emit completion event
          try {
            console.log('Dispatching completion event for topic:', topic.id);
            const event = new CustomEvent('quizCompleted', {
              detail: { topicId: topic.id }
            });
            window.dispatchEvent(event);

            // Direct localStorage update as a fallback
            const storedTopics = localStorage.getItem('completedTopics');
            let completedTopics = storedTopics ? JSON.parse(storedTopics) : [];
            if (!completedTopics.includes(topic.id)) {
              completedTopics.push(topic.id);
              localStorage.setItem('completedTopics', JSON.stringify(completedTopics));
              console.log('Directly updated localStorage with completed topic:', topic.id);
            }
          } catch (error) {
            console.error('Error dispatching completion event:', error);
          }
        }

        // Only show confetti when the user solves the word themselves
        if (!usedSolve) {
          triggerConfetti();
        }
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
    
    // Don't allow dropping on zones that already have a letter
    if (dropZones[dropZoneIndex].letter !== null) return;

    const updatedDropZones = [...dropZones];
    
    // Check if the letter is correct for this position
    const isCorrect = letter.char === currentWordData?.word[dropZoneIndex];
    
    updatedDropZones[dropZoneIndex] = { 
      ...updatedDropZones[dropZoneIndex], 
      letter: letter.char,
      isIncorrect: !isCorrect 
    };
    
    setDropZones(updatedDropZones);

    setLetters(letters.filter(l => l.id !== letterId));
    checkWord(updatedDropZones);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const resetGame = () => {
    initializeGame();
    setTimerStartTime(Date.now()); // Reset timer
    setToast({
      message: 'Moving to next word',
      type: 'success'
    });
    setTimeout(() => setToast(null), 3000);
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

    // Show toast notification
    setToast({
      message: 'Word solved automatically',
      type: 'success'
    });
    setTimeout(() => setToast(null), 3000);

    // Show success animation after a short delay
    setTimeout(() => {
      setSuccess(true);
      setShowError(false);

      // Add word to completed words
      const newCompletedWords = new Set([...completedWords, currentWordData.word]);
      setCompletedWords(newCompletedWords);
      
      // Immediately save progress to ensure it's not lost on page leave
      saveGameState();
      
      // Trigger progress bar animation
      setProgressAnimation(true);
      setTimeout(() => setProgressAnimation(false), 1000);

      // Check if all words in the topic are completed
      if (newCompletedWords.size === topic?.words.length) {
        // Show trophy celebration
        setShowCelebration(true);

        // All words completed, emit completion event
        try {
          console.log('Dispatching completion event for topic:', topic.id);
          const event = new CustomEvent('quizCompleted', {
            detail: { topicId: topic.id }
          });
          window.dispatchEvent(event);

          // Direct localStorage update as a fallback
          const storedTopics = localStorage.getItem('completedTopics');
          let completedTopics = storedTopics ? JSON.parse(storedTopics) : [];
          if (!completedTopics.includes(topic.id)) {
            completedTopics.push(topic.id);
            localStorage.setItem('completedTopics', JSON.stringify(completedTopics));
            console.log('Directly updated localStorage with completed topic:', topic.id);
          }
        } catch (error) {
          console.error('Error dispatching completion event:', error);
        }
      }

      // Don't trigger confetti when using the solve button
      // triggerConfetti(); - removed
      
      setShowScoreAnimation(true);
      setTimeout(() => setShowScoreAnimation(false), 1500);
    }, 500);
  };

  const resetCurrentWord = () => {
    if (!currentWordData) return;
    initializeGameWithWord(currentWordData);
    setToast({
      message: 'Current word has been reset',
      type: 'success'
    });
    setTimeout(() => setToast(null), 3000);
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

          // Don't allow placing letters on zones that already have a letter
          if (dropZones[dropZoneIndex].letter !== null) {
            setIsDragging(false);
            setTouchedLetter(null);
            return;
          }

          // Update dropzones with the letter
          const updatedDropZones = [...dropZones];
          
          // Check if the letter is correct for this position
          const isCorrect = touchedLetter.char === currentWordData?.word[dropZoneIndex];
          
          updatedDropZones[dropZoneIndex] = { 
            ...updatedDropZones[dropZoneIndex], 
            letter: touchedLetter.char,
            isIncorrect: !isCorrect 
          };
          
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

  // Timer tick function
  const timerTick = () => {
    if (success) return;

    const now = Date.now();
    const elapsed = now - timerStartTime;
    
    const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((elapsed % (1000 * 60)) / 1000);
    
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = seconds.toString().padStart(2, '0');
    
    setTimerText(`${formattedMinutes}:${formattedSeconds}`);
    
    requestRef.current = requestAnimationFrame(timerTick);
  };

  // Start the timer
  useEffect(() => {
    requestRef.current = requestAnimationFrame(timerTick);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [timerStartTime, success]);

  // Reset timer when loading a new word
  useEffect(() => {
    if (!success) {
      setTimerStartTime(Date.now());
    }
  }, [currentWordData]);

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

  // Add this new function directly after the handleSolveClick function
  const forceCompleteAllWords = () => {
    if (!topic) return;

    // Mark all words as completed
    const allWords = new Set(topic.words.map(word => word.word));
    setCompletedWords(allWords);
    
    // Immediately save progress to ensure it's not lost on page leave
    saveGameState();
    
    // Trigger progress bar animation
    setProgressAnimation(true);
    setTimeout(() => setProgressAnimation(false), 1000);

    // Show trophy celebration
    setShowCelebration(true);

    // Update localStorage directly
    try {
      const storedTopics = localStorage.getItem('completedTopics');
      let completedTopics = storedTopics ? JSON.parse(storedTopics) : [];
      if (!completedTopics.includes(topic.id)) {
        completedTopics.push(topic.id);
        localStorage.setItem('completedTopics', JSON.stringify(completedTopics));
        console.log('Force completed topic:', topic.id);
      }

      // Dispatch event as well
      const event = new CustomEvent('quizCompleted', {
        detail: { topicId: topic.id }
      });
      window.dispatchEvent(event);

      // Show toast notification
      setToast({
        message: `Topic "${topic.name}" has been force completed!`,
        type: 'success'
      });
      setTimeout(() => setToast(null), 3000);
    } catch (error) {
      console.error('Error force completing topic:', error);
      setToast({
        message: 'Error while force completing topic',
        type: 'error'
      });
      setTimeout(() => setToast(null), 3000);
    }
  };

  // New function to handle removing letters from dropzones when clicked
  const handleLetterClick = (dropZoneId: string) => {
    const dropZoneIndex = dropZones.findIndex(zone => zone.id === dropZoneId);
    
    // Don't allow removing pre-filled letters
    if (dropZones[dropZoneIndex].isPrefilled) return;
    
    const letter = dropZones[dropZoneIndex].letter;
    if (letter === null) return;
    
    // Create a new letter object and add it back to the letters array
    const newLetter = {
      id: `letter-${Date.now()}`, // Create a unique ID
      char: letter,
      position: {
        x: 40 + (Math.random() * 20), // Position somewhat in the middle
        y: 40 + (Math.random() * 20)
      }
    };
    
    // Update the dropzones to remove the letter
    const updatedDropZones = [...dropZones];
    updatedDropZones[dropZoneIndex] = { 
      ...updatedDropZones[dropZoneIndex], 
      letter: null,
      isIncorrect: false // Remove the incorrect flag if it was set
    };
    
    setDropZones(updatedDropZones);
    setLetters([...letters, newLetter]);
  };

  useEffect(() => {
    // Save completed words to localStorage
    localStorage.setItem("completedWords", JSON.stringify(Array.from(completedWords)));

    // Dispatch custom event for StatsCard component
    const event = new CustomEvent('gameStateChanged');
    window.dispatchEvent(event);
  }, [completedWords]);

  useEffect(() => {
    if (currentWordData) {
      // Save current word to sessionStorage for StatsCard component
      sessionStorage.setItem('currentGame', JSON.stringify({
        topic: topic,
        currentWord: currentWordData.word
      }));

      // Dispatch custom event for StatsCard component
      const event = new CustomEvent('gameStateChanged');
      window.dispatchEvent(event);
    }
  }, [currentWordData, topic]);

  // Update the saveGameState function to be more reliable
  const saveGameState = () => {
    try {
      if (!topic || !topicId) return;
      
      console.log('Saving game state for topic:', topicId);
      const gameState = {
        topicId,
        completedWords: Array.from(completedWords),
        score,
        currentWord: currentWordData?.word,
        lastSaved: new Date().toISOString(),
        version: '1.0'
      };
      
      // Ensure we're using stringify correctly
      const gameStateString = JSON.stringify(gameState);
      console.log('Saving game state:', gameStateString);
      
      // Save to topic-specific storage
      localStorage.setItem(`gameState_${topicId}`, gameStateString);
      console.log(`Saved ${completedWords.size} completed words for topic ${topicId}`);
      
      // Also update global completed words list
      try {
        // Get existing global completed words
        const existingGlobalData = localStorage.getItem('completedWords');
        let allCompletedWords: string[] = [];
        
        if (existingGlobalData) {
          const parsed = JSON.parse(existingGlobalData);
          if (Array.isArray(parsed)) {
            // Filter out any words from this topic (to avoid duplicates)
            const topicWords = topic.words.map(w => w.word);
            allCompletedWords = parsed.filter(word => !topicWords.includes(word));
          }
        }
        
        // Add current topic's completed words
        allCompletedWords = [...allCompletedWords, ...Array.from(completedWords)];
        
        // Save back to global storage
        localStorage.setItem('completedWords', JSON.stringify(allCompletedWords));
        console.log('Updated global completed words list, new length:', allCompletedWords.length);
      } catch (e) {
        console.error('Error updating global completed words:', e);
      }
      
      // Add special debug indicator for easier troubleshooting
      localStorage.setItem('saveTimestamp', new Date().toISOString());
    } catch (error) {
      console.error('Error saving game state:', error);
    }
  };

  // Update the saveGameState calls to be more immediate and reliable
  useEffect(() => {
    // Only save when we have meaningful data
    if (topicId && topic && (completedWords.size > 0 || score > 0)) {
      console.log('Auto-saving game state due to state change');
      saveGameState();
    }
  }, [completedWords, score, currentWordData]);

  // Add function to initialize game with specific word
  const initializeGameWithWord = (wordData: typeof currentWordData) => {
    if (!wordData) return;

    setCurrentWordData(wordData);
    setShowError(false);
    setSuccess(false);
    setUsedSolve(false);

    // Initialize drop zones
    const wordLength = wordData.word.length;

    // Determine how many letters to pre-fill - never more than 3
    let numToFill = 0;
    if (wordLength >= 5) {
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
    const initialDropZones = wordData.word.split('').map((letter, index) => {
      const shouldPreFill = fillPositions.includes(index);
      return {
        id: `dropzone-${index}`,
        letter: shouldPreFill ? letter : null,
        isPrefilled: shouldPreFill,
        isIncorrect: false
      };
    });

    setDropZones(initialDropZones);

    // Combine target word and extra letters, but only include letters that aren't pre-filled
    const preFilledLetters = initialDropZones
      .filter(zone => zone.letter !== null)
      .map(zone => zone.letter as string);

    const remainingWordLetters = wordData.word
      .split('')
      .filter(letter => !preFilledLetters.includes(letter) ||
        preFilledLetters.indexOf(letter) !== preFilledLetters.lastIndexOf(letter));

    const allLetters = (remainingWordLetters.join('') + wordData.extraLetters).split('');

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

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8 pt-16">
        {/* Social Links */}
        <SocialLinks />

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
                    onClick={() => zone.letter && !zone.isPrefilled ? handleLetterClick(zone.id) : null}
                    className={`drop-zone w-12 h-12 sm:w-16 sm:h-16 border-2 
                      ${zone.letter
                        ? zone.isPrefilled
                          ? 'border-blue-500 bg-blue-50'
                          : zone.isIncorrect
                            ? 'border-red-500 bg-red-50'
                            : 'border-green-500 bg-green-50'
                        : 'border-dashed border-gray-400'
                      } rounded-lg flex items-center justify-center transition-all
                      ${zone.letter && !zone.isPrefilled ? 'cursor-pointer' : ''}`}
                  >
                    {zone.letter && (
                      <span className={`text-xl sm:text-2xl font-bold 
                        ${zone.isPrefilled 
                          ? 'text-blue-700' 
                          : zone.isIncorrect 
                            ? 'text-red-700' 
                            : 'text-green-700'}`}
                      >
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

              <div className="relative w-full h-[250px] sm:h-[300px] bg-white/50 rounded-xl p-4 border border-blue-100 shadow-sm">
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
                
                {/* Chronograph Timer */}
                <div className="absolute bottom-2 right-2 bg-blue-100 rounded-full h-12 w-12 flex items-center justify-center overflow-hidden z-10">
                  <div className="timer-group relative h-full w-full">
                    <div className="timer minute absolute inset-0 rounded-full overflow-hidden">
                      <div className="hand"><span></span></div>
                      <div className="hand"><span></span></div>
                    </div>
                    <div className="timer second absolute inset-0 rounded-full overflow-hidden" style={{ transform: 'scale(0.85)', margin: 'auto' }}>
                      <div className="hand"><span></span></div>
                      <div className="hand"><span></span></div>
                    </div>
                    <div className="face absolute inset-0 flex items-center justify-center rounded-full">
                      <p id="timer-display" className="text-xs font-mono text-blue-700">{timerText}</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <div className="fixed bottom-0 left-0 right-0 z-10 bg-white/90 p-2 text-center text-xs text-gray-500 md:hidden">
              Tap and drag letters to the boxes above
            </div>
          </main>

          <div className="text-center mt-6 mb-8 p-4 bg-white/80 rounded-lg shadow-sm border border-blue-100">
            <p className="text-gray-600">
              <span className="font-semibold">Hint:</span> {currentWordData?.hint}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-blue-700">Topic Progress</span>
              <span className="text-sm font-medium text-blue-700">
                {completedWords.size} / {topic?.words.length || 0} words
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
              <div 
                className="bg-blue-300 h-4 rounded-full transition-all duration-500 flex items-center justify-center relative overflow-hidden"
                style={{ width: `${topic?.words.length ? (completedWords.size / topic.words.length) * 100 : 0}%` }}
                role="progressbar" 
                aria-valuenow={topic?.words.length ? (completedWords.size / topic.words.length) * 100 : 0} 
                aria-valuemin={0} 
                aria-valuemax={100}
              >
                <div className="absolute inset-0 bg-white bg-opacity-30 overflow-hidden animate-progress-stripes" style={{ 
                  backgroundImage: 'linear-gradient(45deg, rgba(255,255,255,.25) 25%, transparent 25%, transparent 50%, rgba(255,255,255,.25) 50%, rgba(255,255,255,.25) 75%, transparent 75%, transparent)', 
                  backgroundSize: '1rem 1rem'
                }}></div>
                {completedWords.size > 0 && topic?.words && completedWords.size === topic.words.length && (
                  <span className="text-xs text-white px-2 font-bold animate-bounce relative z-10">Complete!</span>
                )}
              </div>
            </div>
          </div>

          {success && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-8 rounded-xl text-center max-w-lg w-full mx-4">
                <Sparkles className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-4" style={{ color: usedSolve ? '#6B7280' : '#15803D' }}>
                  {usedSolve ? 'Word Solved' : 'Congratulations!'}
                </h2>
                <p className="text-gray-600 mb-2">
                  {usedSolve 
                    ? 'Solved with help! It\'s okay to get a little boost. Ready for the next challenge?' 
                    : 'You successfully formed the word!'}
                </p>
                
                {/* Word Details Section */}
                <div className="mt-4 mb-6 text-left bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-xl font-bold text-blue-800 mb-2">{currentWordData?.word}</h3>
                  {currentWordData?.pronunciation && (
                    <p className="text-gray-600 mb-2">
                      <span className="font-semibold">Pronunciation:</span> {currentWordData.pronunciation}
                    </p>
                  )}
                  {currentWordData?.meaning && (
                    <p className="text-gray-600 mb-2">
                      <span className="font-semibold">Meaning:</span> {currentWordData.meaning}
                    </p>
                  )}
                  {currentWordData?.audioUrl && (
                    <div className="mt-2">
                      <audio controls className="w-full">
                        <source src={currentWordData.audioUrl} type="audio/mpeg" />
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                  )}
                </div>

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

          <div className="flex justify-center gap-2 mb-6">
            <button
              className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              onClick={resetCurrentWord}
            >
              Reset
            </button>

            {/* Debug button for force completing */}
            <button
              className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
              onClick={forceCompleteAllWords}
            >
              Force Complete
            </button>
          </div>
        </div>
        <VisitCounter />

        {/* Toast notification */}
        {toast && (
          <div
            className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 transition-all duration-300 ease-in-out animate-fade-in ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white`}
            role="alert"
          >
            {toast.type === 'success' ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <X className="h-5 w-5" />
            )}
            <span>{toast?.message}</span>
            <button
              onClick={() => setToast(null)}
              className="ml-2 opacity-70 hover:opacity-100"
              aria-label="Close notification"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Add Reset Confirmation Modal */}
        {showResetConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
              <h3 className="text-xl font-bold text-red-600 mb-4">Reset Progress</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to reset your progress for this topic? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    localStorage.removeItem(`gameState_${topicId}`);
                    setCompletedWords(new Set());
                    setScore(0);
                    initializeGame();
                    setShowResetConfirm(false);
                    showToast('Progress has been reset for this topic', 'success');
                  }}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Reset Progress
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-12 text-center">
        <div className="bg-white p-6 rounded-xl shadow-md max-w-4xl mx-auto">
          <p className="font-medium text-blue-800">&copy; {new Date().getFullYear()} Word Making Games</p>
          <p className="mt-2 text-gray-600 text-sm">
            Improve your vocabulary with our educational word games.
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

      {/* Modals */}
      {showAboutModal && <AboutModal isOpen={showAboutModal} onClose={() => setShowAboutModal(false)} />}
      {showPrivacyModal && <PrivacyModal isOpen={showPrivacyModal} onClose={() => setShowPrivacyModal(false)} />}
      {showContactModal && <ContactModal isOpen={showContactModal} onClose={() => setShowContactModal(false)} />}

      {/* Add Reset Progress button */}
      <button
        onClick={() => setShowResetConfirm(true)}
        className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
      >
        Reset Topic Progress
      </button>

      {/* Add Timer Styles */}
      <style jsx>{`
        .timer .hand span {
          animation-iteration-count: infinite;
          animation-timing-function: linear;
        }
        
        .timer .hand:first-child {
          transform: rotate(180deg);
        }
        
        .timer .hand:first-child span {
          animation-name: spin1;
        }
        
        .timer .hand:last-child span {
          animation-name: spin2;
        }
        
        .timer.minute .hand span {
          animation-duration: 60s;
          border-top-color: rgba(59, 130, 246, 0.6);
          border-right-color: rgba(59, 130, 246, 0.6);
        }
        
        .timer.second .hand span {
          animation-duration: 1s;
          border-top-color: rgba(59, 130, 246, 0.8);
          border-right-color: rgba(59, 130, 246, 0.8);
        }
        
        .timer .hand span {
          border: 5px solid transparent;
          border-bottom-color: transparent;
          border-left-color: transparent;
          border-radius: 50%;
          display: block;
          height: 0;
          position: absolute;
          right: 0;
          top: 0;
          transform: rotate(225deg);
          width: 0;
        }
        
        @keyframes spin1 {
          0% { transform: rotate(225deg); }
          50% { transform: rotate(225deg); }
          100% { transform: rotate(405deg); }
        }
        
        @keyframes spin2 {
          0% { transform: rotate(225deg); }
          50% { transform: rotate(405deg); }
          100% { transform: rotate(405deg); }
        }
      `}</style>
    </>
  );
}

export default GamePage;