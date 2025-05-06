"use client";

import React, { useState, useEffect, useRef } from 'react';

const VisitCounter: React.FC = () => {
  const [count, setCount] = useState<number>(0);
  const hasIncremented = useRef(false);

  useEffect(() => {
    if (hasIncremented.current) return;

    // Get the stored count from localStorage
    const storedCount = localStorage.getItem('visitCount');

    // If it exists, parse and increment
    if (storedCount) {
      const newCount = parseInt(storedCount, 10) + 1;
      setCount(newCount);
      localStorage.setItem('visitCount', newCount.toString());
    } else {
      // If no stored count, set to 1
      setCount(1);
      localStorage.setItem('visitCount', '1');
    }

    hasIncremented.current = true;
  }, []);

  return (
    <div className="fixed bottom-3 right-3 bg-blue-100 bg-opacity-80 text-blue-800 text-xs px-2 py-1 rounded-md shadow-sm">
      Visits: {count}
    </div>
  );
};

export default VisitCounter; 