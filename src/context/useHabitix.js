import { useContext } from 'react';
import { HabitixContext } from './HabitixContextDefinition';

export function useHabitix() {
  const context = useContext(HabitixContext);
  if (!context) {
    throw new Error('useHabitix must be used within a HabitixProvider');
  }
  return context;
}
