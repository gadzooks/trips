// YahooLoginButton.tsx


'use client';

import React, { useEffect, useState, useCallback, createContext, useContext } from 'react';
import { useRouter } from 'next/navigation';

// Context for Yahoo authentication
type YahooAuthContextType = {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any | null;
  logout: () => void;
};

const YahooAuthContext = createContext<YahooAuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  user: null,
  logout: () => {},
});

// Provider component
export function YahooAuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<any | null>(null);
  const router = useRouter();

  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = () => {
      try {
        const userCookie = document.cookie
          .split('; ')
          .find(row => row.startsWith('user='));
        
        if (userCookie) {
          const userData = JSON.parse(decodeURIComponent(userCookie.split('=')[1]));
          if (userData.provider === 'yahoo') {
            setUser(userData);
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
            setUser(null);
          }
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
    
    // Check auth status when window is focused
    const handleFocus = () => checkAuth();
    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  // Function to refresh token
  const refreshToken = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/yahoo/refresh');
      
      if (!response.ok) {
        throw new Error('Token refresh failed');
      }
      
      return true;
    } catch (error) {
      console.error('Token refresh error:', error);
      setIsAuthenticated(false);
      setUser(null);
      return false;
    }
  }, []);

  // Set up token refresh interval
  useEffect(() => {
    if (!isAuthenticated) return;
    
    // Refresh token every 50 minutes (assuming 1 hour expiry)
    const intervalId = setInterval(() => {
      refreshToken();
    }, 50 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, [isAuthenticated, refreshToken]);

  // Logout function
  const logout = useCallback(async () => {
    try {
      // Clear cookies
      document.cookie = 'yahoo_access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie = 'yahoo_refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie = 'user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, []);

  return (
    <YahooAuthContext.Provider value={{ isAuthenticated, isLoading, user, logout }}>
      {children}
    </YahooAuthContext.Provider>
  );
}

// Hook for using Yahoo auth context
export function useYahooAuth() {
  return useContext(YahooAuthContext);
}

// YahooLoginButton component
interface YahooLoginButtonProps {
  className?: string;
  label?: string;
}

export default function YahooLoginButton({ 
  className = '', 
  label = 'Sign in with Yahoo' 
}: YahooLoginButtonProps) {
  const router = useRouter();

  const handleLogin = async () => {
    router.push('/api/auth/yahoo');
  };

  return (
    <button
      onClick={handleLogin}
      className={`flex items-center justify-center gap-2 rounded-md bg-purple-600 px-4 py-2 text-white hover:bg-purple-700 ${className}`}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 512 512">
        <path fill="currentColor" d="M223.69 141.06C307 141 389.89 143.73 448 154.83a1 1 0 01.75.75c9.7 56.27 12.21 138.73 12.21 221.82s-2.51 165.55-12.21 221.84a1 1 0 01-.75.75c-58.11 11.1-141 13.79-224.27 13.79-83.8 0-166.69-2.71-224.78-13.79a1 1 0 01-.75-.75C9.1 543.14 6.6 460.69 6.6 377.6s2.51-165.55 12.21-221.82a1 1 0 01.75-.75c-3.77-15.95-23.83-11.1 140.93-13.97z"/>
        <path fill="white" d="M260.57 313.46h36.57l-17.34-59.2-19.23 59.2zm99.66-180.03l-25.55.19c-.24.58-.72 1.58-.72 1.58-21.05 50.66-45.41 109.48-66.55 160.14 0 0-5.3 12.82-7.86 19.13l-46.54-.2c-2.6-6.31-7.91-19.13-7.91-19.13-17.84-43.4-43.96-108.01-63.24-158.72-1.35-3.49-1.94-5.2-2.18-5.8h-41.35l83.39 189.71-37.95 91.76h39.97l119.6-278.66h-43.11z"/>
      </svg>
      {label}
    </button>
  );
}