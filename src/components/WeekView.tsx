import React, { useEffect } from 'react';
import TaskInput from './TaskInput';
import styles from '../App.module.css';
import { AppState, Task } from '../types/types';
import { Droppable, Draggable } from 'react-beautiful-dnd';

interface WeekViewProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  onMonthClick: () => void;
}

const daysOfWeek = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

const WeekView: React.FC<WeekViewProps> = ({
  state,
  setState,
  onMonthClick,
}) => {
  const addTask = (dayId: string, content: string) => {
    const newTaskId = `task-${Date.now()}`;
    const newTask: Task = { id: newTaskId, content };
    const newColumn = {
      ...state.columns[dayId],
      taskIds: [...state.columns[dayId].taskIds, newTaskId],
    };

    const newState = {
      ...state,
      tasks: {
        ...state.tasks,
        [newTaskId]: newTask,
      },
      columns: {
        ...state.columns,
        [newColumn.id]: newColumn,
      },
    };

    setState(newState);
  };

  return (
    <div>
      <h1>Week View</h1>
      <button onClick={onMonthClick}>Back to Month View</button>
      <div className={styles.weekGrid}>
        {daysOfWeek.map((dayId) => {
          const column = state.columns[dayId] || {
            id: dayId,
            title: dayId.charAt(0).toUpperCase() + dayId.slice(1),
            taskIds: [],
          };
          const tasks = column.taskIds.map((taskId) => state.tasks[taskId]);

          return (
            <div key={dayId} className={styles.dayColumn}>
              <h2>{column.title}</h2>
              <TaskInput
                onAddTask={(content: string) => addTask(dayId, content)}
              />
              <Droppable droppableId={dayId}>
                {(provided) => (
                  <div
                    className={styles.column}
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {tasks.map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            className={styles.task}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            {task.content}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeekView;
