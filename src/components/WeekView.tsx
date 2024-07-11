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
  useEffect(() => {
    const savedState = localStorage.getItem('appState');
    if (savedState) {
      setState(JSON.parse(savedState));
    }
  }, [setState]);

  useEffect(() => {
    localStorage.setItem('appState', JSON.stringify(state));
  }, [state]);

  const addTask = (dayId: string, content: string) => {
    const newTaskId = `task-${Date.now()}`;
    const newTask: Task = { id: newTaskId, content, completed: false };
    const newColumn = {
      ...state.columns[dayId],
      taskIds: [...(state.columns[dayId]?.taskIds || []), newTaskId],
    };

    const newState = {
      ...state,
      tasks: {
        ...state.tasks,
        [newTaskId]: newTask,
      },
      columns: {
        ...state.columns,
        [dayId]: newColumn,
      },
    };

    setState(newState);
  };

  const toggleTaskCompletion = (taskId: string) => {
    const updatedTask = {
      ...state.tasks[taskId],
      completed: !state.tasks[taskId].completed,
    };

    const newState = {
      ...state,
      tasks: {
        ...state.tasks,
        [taskId]: updatedTask,
      },
    };

    setState(newState);
  };

  const deleteTask = (dayId: string, taskId: string) => {
    const newTaskIds = state.columns[dayId].taskIds.filter(id => id !== taskId);
    const newColumn = {
      ...state.columns[dayId],
      taskIds: newTaskIds,
    };

    const { [taskId]: _, ...newTasks } = state.tasks;

    const newState = {
      ...state,
      tasks: newTasks,
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
          const tasks = column.taskIds.map((taskId) => state.tasks[taskId]).filter(Boolean);

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
                            className={`${styles.task} ${task.completed ? styles.completed : ''}`}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <label>
                              <input
                                type="checkbox"
                                checked={task.completed}
                                onChange={() => toggleTaskCompletion(task.id)}
                              />
                              <span>{task.content}</span>
                            </label>
                            <button onClick={() => deleteTask(dayId, task.id)}>Delete</button>
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

