import React, { useState, useEffect } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import MonthView from './components/MonthView';
import WeekView from './components/WeekView';
import { AppState } from './types/types';

const initialData: AppState = {
  tasks: {
    'task-1': { id: 'task-1', content: 'Take out the garbage' },
    'task-2': { id: 'task-2', content: 'Watch my favorite show' },
    'task-3': { id: 'task-3', content: 'Charge my phone' },
    'task-4': { id: 'task-4', content: 'Cook dinner' },
  },
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
  const [state, setState] = useState<AppState>(() => {
    const storedState = localStorage.getItem('todoState');
    return storedState ? JSON.parse(storedState) : initialData;
  });
  const today = new Date();
  const weekdays = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  const currentDay = weekdays[today.getDay()];
  
  const [view, setView] = useState<'month' | 'week'>('month');
  const [selectedWeek, setSelectedWeek] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('todoState', JSON.stringify(state));
  }, [state]);

  const handleWeekClick = (weekId: string) => {
    setSelectedWeek(weekId);
    setView('week');
  };

  const handleMonthClick = () => {
    setView('month');
  };

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const startColumn = state.columns[source.droppableId];
    const finishColumn = state.columns[destination.droppableId];

    if (startColumn === finishColumn) {
      const newTaskIds = Array.from(startColumn.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...startColumn,
        taskIds: newTaskIds,
      };

      const newState = {
        ...state,
        columns: {
          ...state.columns,
          [newColumn.id]: newColumn,
        },
      };

      setState(newState);
      return;
    }

    const startTaskIds = Array.from(startColumn.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStartColumn = {
      ...startColumn,
      taskIds: startTaskIds,
    };

    const finishTaskIds = Array.from(finishColumn.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinishColumn = {
      ...finishColumn,
      taskIds: finishTaskIds,
    };

    const newState = {
      ...state,
      columns: {
        ...state.columns,
        [newStartColumn.id]: newStartColumn,
        [newFinishColumn.id]: newFinishColumn,
      },
    };

    setState(newState);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div>
        {view === 'month' && (
          <MonthView state={state} onWeekClick={handleWeekClick} />
        )}
        {view === 'week' && (
          <WeekView
            state={state}
            setState={setState}
            onMonthClick={handleMonthClick}
          />
        )}
      </div>
    </DragDropContext>
  );
};

export default App;
