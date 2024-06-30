import React, { useState, useEffect } from 'react';
import MonthView from './components/MonthView';
import WeekView from './components/WeekView';
import { AppState } from './types/types';

const initialData: AppState = {
  tasks: {},
  columns: {},
  columnOrder: [],
};

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(() => {
    const storedState = localStorage.getItem('todoState');
    return storedState ? JSON.parse(storedState) : initialData;
  });
  const [view, setView] = useState<'month' | 'week'>('month');
  const [selectedWeek, setSelectedWeek] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('todoState', JSON.stringify(state));
  }, [state]);

  const handleWeekClick = (weekId: string) => {
    setSelectedWeek(weekId);
    setView('week');
  };

  return (
    <div>
      {view === 'month' && <MonthView state={state} onWeekClick={handleWeekClick} />}
      {view === 'week' && selectedWeek && (
        <WeekView state={state} setState={setState} weekId={selectedWeek} />
      )}
    </div>
  );
};

export default App;
