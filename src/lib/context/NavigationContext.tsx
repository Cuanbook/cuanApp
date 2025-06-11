import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';

interface NavigationContextType {
  isLoading: boolean;
  loadingMessage: string;
  startLoading: (message?: string) => void;
  stopLoading: () => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Memuat...');
  const timeoutRef = useRef<number>();
  const minimumLoadingTime = 500; // Minimum time to show loading in ms
  const loadingStartTime = useRef<number>(0);

  const startLoading = useCallback((message?: string) => {
    if (message) {
      setLoadingMessage(message);
    }
    loadingStartTime.current = Date.now();
    setIsLoading(true);
  }, []);

  const stopLoading = useCallback(() => {
    // Calculate remaining time to meet minimum loading duration
    const elapsedTime = Date.now() - loadingStartTime.current;
    const remainingTime = Math.max(0, minimumLoadingTime - elapsedTime);

    // Clear any existing timeout
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    // Set timeout to stop loading after remaining time
    timeoutRef.current = window.setTimeout(() => {
      setIsLoading(false);
      setLoadingMessage('Memuat...'); // Reset message
    }, remainingTime);
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <NavigationContext.Provider value={{ isLoading, loadingMessage, startLoading, stopLoading }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};