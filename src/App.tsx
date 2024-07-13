import React, { useState, useEffect } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import MonthView from './components/MonthView';
import WeekView from './components/WeekView';
import { AppState } from './types/types';

const initialState: AppState = {
  tasks: {},
  columns: {
    monday: { id: 'monday', title: 'Monday', taskIds: [] },
    tuesday: { id: 'tuesday', title: 'Tuesday', taskIds: [] },
    wednesday: { id: 'wednesday', title: 'Wednesday', taskIds: [] },
    thursday: { id: 'thursday', title: 'Thursday', taskIds: [] },
    friday: { id: 'friday', title: 'Friday', taskIds: [] },
    saturday: { id: 'saturday', title: 'Saturday', taskIds: [] },
    sunday: { id: 'sunday', title: 'Sunday', taskIds: [] },
  },
  columnOrder: [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
  ],
};

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(initialState);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleWeekClick = (date: Date) => {
    setSelectedDate(date);
  };

  const handleMonthClick = () => {
    setSelectedDate(null);
  };

  return (
    <div className="App">
      {selectedDate ? (
        <WeekView state={state} setState={setState} selectedDate={selectedDate} onMonthClick={handleMonthClick} />
      ) : (
        <MonthView state={state} onWeekClick={handleWeekClick} />
      )}
    </div>
  );
};

export default App;
