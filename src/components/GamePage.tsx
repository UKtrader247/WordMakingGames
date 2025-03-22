import React, { useState, useEffect } from 'react';
import { Sparkles, RotateCcw, AlertCircle, Home, Lightbulb } from 'lucide-react';
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
    const initialDropZones = newWordData.word.split('').map((_, index) => ({
      id: `dropzone-${index}`,
      letter: null
    }));
    setDropZones(initialDropZones);

    // Combine target word and extra letters
    const allLetters = (newWordData.word + newWordData.extraLetters).split('');

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
        setCompletedWords(prev => new Set([...prev, currentWordData.word]));
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
      setCompletedWords(prev => new Set([...prev, currentWordData.word]));
      triggerConfetti();
      setScore(prevScore => prevScore + 5); // Award half points for using solve
      setShowScoreAnimation(true);
      setTimeout(() => setShowScoreAnimation(false), 1500);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8 pt-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 relative">
          <button
            onClick={() => navigate('/')}
            className="absolute left-0 top-0 flex items-center gap-2 px-4 py-2 bg-white/80 text-blue-600 
              rounded-lg hover:bg-white transition-colors duration-200 shadow-sm"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </button>
          <h1 className="text-4xl font-bold text-blue-800 mb-4">
            {topic?.name || 'Word Making Game'}
          </h1>
          <div className="flex items-center justify-center gap-8 mb-4">
            <p className="text-gray-600">Drag the letters to form the word</p>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Score:</span>
              <span className={`text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent
                ${showScoreAnimation ? 'animate-bounce' : ''}`}>
                {score}
              </span>
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            Words Completed: {completedWords.size} / {topic?.words.length || 0}
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-4">
            <span className="px-2 py-1 bg-gray-100 rounded">
              Current Word Length: {currentWordData?.word.length || 0}
            </span>
          </div>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={resetGame}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg 
                hover:bg-blue-700 transition-colors duration-200"
            >
              <RotateCcw className="w-4 h-4" />
              Next Word
            </button>

            <button
              onClick={handleSolveClick}
              className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg 
                hover:bg-amber-600 transition-colors duration-200"
              disabled={success || usedSolve}
            >
              <Lightbulb className="w-4 h-4" />
              Solve
            </button>
          </div>
        </div>

        {showError && (
          <div className="flex items-center justify-center gap-2 text-red-600 mb-6 animate-bounce">
            <AlertCircle className="w-5 h-5" />
            <p>Incorrect word! Try again.</p>
          </div>
        )}

        <div className="flex justify-center gap-4 mb-16">
          {dropZones.map((zone) => (
            <div
              key={zone.id}
              onDrop={(e) => handleDrop(e, zone.id)}
              onDragOver={handleDragOver}
              className={`drop-zone w-16 h-16 border-2 ${zone.letter ? 'border-green-500 bg-green-50' : 'border-dashed border-gray-400'
                } rounded-lg flex items-center justify-center transition-all`}
            >
              {zone.letter && (
                <span className="text-2xl font-bold text-green-700">
                  {zone.letter}
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="relative w-full h-[300px] bg-white/50 rounded-xl p-4">
          {letters.map((letter) => (
            <div
              key={letter.id}
              draggable
              onDragStart={(e) => handleDragStart(e, letter.id)}
              onDragEnd={handleDragEnd}
              style={{
                position: 'absolute',
                left: `${letter.position.x}%`,
                top: `${letter.position.y}%`,
                transform: `rotate(${Math.random() * 20 - 10}deg)`,
                cursor: 'grab'
              }}
              className={`w-12 h-12 bg-white shadow-lg rounded-lg flex items-center justify-center
                ${isDragging ? 'opacity-50' : 'opacity-100'}
                hover:scale-110 transition-all duration-200`}
            >
              <span className="text-xl font-bold text-blue-700">{letter.char}</span>
            </div>
          ))}
        </div>

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
      </div>
      <VisitCounter />
    </div>
  );
}

export default GamePage;