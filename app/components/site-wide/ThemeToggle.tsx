import React, { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';

interface ThemeToggleProps {
  isDark: boolean;
  toggle: () => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ isDark: initialIsDark, toggle }) => {
  const [isDark, setIsDark] = useState<boolean>(initialIsDark);
  
  useEffect(() => {
    setIsDark(initialIsDark);
  }, [initialIsDark]);

  const handleToggle = (): void => {
    setIsDark(!isDark);
    toggle();
  };

  return (
    <button
      onClick={handleToggle}
      type="button"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      className="relative h-10 w-20 rounded-full bg-gray-200 dark:bg-gray-700 transition-colors duration-200"
    >
      <div
        className={`absolute top-1 left-1 h-8 w-8 rounded-full bg-white shadow-md transform transition-transform duration-200 flex items-center justify-center ${
          isDark ? 'translate-x-10' : 'translate-x-0'
        }`}
      >
        {isDark ? (
          <Moon className="h-4 w-4 text-gray-700" />
        ) : (
          <Sun className="h-4 w-4 text-yellow-500" />
        )}
      </div>
    </button>
  );
};

export default ThemeToggle;