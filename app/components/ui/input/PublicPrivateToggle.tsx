// app/components/ui/input/PublicPrivateToggle.tsx
import React, { useState, useEffect } from 'react';
import { CircleOff, UserCheck, Users } from 'lucide-react';

interface PublicPrivateToggleProps {
  isPrivate: boolean;
  toggle: () => void;
}

const PublicPrivateToggle: React.FC<PublicPrivateToggleProps> = ({ isPrivate: initialIsPrivate, toggle }) => {
  const [isPrivate, setIsPrivate] = useState<boolean>(initialIsPrivate);
  
  useEffect(() => {
    setIsPrivate(initialIsPrivate);
  }, [initialIsPrivate]);

  const handleToggle = (): void => {
    setIsPrivate(!isPrivate);
    toggle();
  };

  return (
    <button
      onClick={handleToggle}
      type="button"
      aria-label={`Switch to ${isPrivate ? 'Public' : 'Private'} mode`}
      className={`relative h-10 w-20 rounded-full bg-gray-200 Private:bg-gray-700 transition-colors duration-200
          ${ isPrivate ? 'bg-red-100' : ' bg-green-100' }`
      }
    >
      <div
        className={`absolute top-1 left-1 h-8 w-8 rounded-full bg-white shadow-md transform transition-transform duration-200 flex items-center justify-center 
          ${ isPrivate ? 'translate-x-10 bg-red-400' : 'translate-x-0 bg-green-400' }`
        }
      >
        {isPrivate ? (
          <CircleOff className="h-4 w-4 text-red-900" />
        ) : (
          <Users className="h-4 w-4 text-green-900" />
        )}
      </div>
    </button>
  );
};

export default PublicPrivateToggle;