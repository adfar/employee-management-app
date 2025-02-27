import { useEffect } from 'react';
import { useEmployeeStore } from '../store/employeeStore';

type KeyboardActions = {
  toggleAddEmployee: () => void;
}

/**
 * Custom hook to handle keyboard shortcuts for the application
 */
export const useKeyboardShortcuts = ({ toggleAddEmployee }: KeyboardActions): void => {
  const { toggleMode } = useEmployeeStore();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in form inputs
      if (event.target instanceof HTMLInputElement || 
          event.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (event.key.toLowerCase()) {
        case 'e': // Toggle between edit and manage modes
          toggleMode();
          break;
        case 'a': // Activate add employee form
          toggleAddEmployee();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [toggleMode, toggleAddEmployee]);
};