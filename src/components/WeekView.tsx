import React, { useEffect } from 'react';
import TaskInput from './TaskInput';
import styles from '../App.module.css';
import { AppState, Task } from '../types/types';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import Container from '../style/Container';
import Subtitle from '../style/Subtitle';
import Text from '../style/Text';
import Title from '../style/Title';
import { formatDay, formatMonth } from '../utils/dateUtils';

interface WeekViewProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  selectedDate: Date;
  onMonthClick: () => void;
}

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const WeekView: React.FC<WeekViewProps> = ({ state, setState, selectedDate, onMonthClick }) => {
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
    const newTaskIds = state.columns[dayId].taskIds.filter((id) => id !== taskId);
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

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    const start = state.columns[source.droppableId];
    const finish = state.columns[destination.droppableId];

    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...start,
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

    const startTaskIds = Array.from(start.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart = {
      ...start,
      taskIds: startTaskIds,
    };

    const finishTaskIds = Array.from(finish.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish = {
      ...finish,
      taskIds: finishTaskIds,
    };

    const newState = {
      ...state,
      columns: {
        ...state.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    };

    setState(newState);
  };

  const startOfWeek = new Date(selectedDate);
  startOfWeek.setDate(selectedDate.getDate() - ((selectedDate.getDay() + 6) % 7)); // Monday as the start of the week

  const week = Array.from({ length: 7 }, (_, dayIndex) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + dayIndex);
    return date;
  });

  const today = new Date();

  return (
    <Container>
      {/* <Subtitle>Week View</Subtitle> */}
      <Text><div onClick={onMonthClick}>Back to Month View</div></Text>
      <DragDropContext onDragEnd={onDragEnd}>
        <div>
          {week.map((date) => {
            const dayId = `column-${date.getDate()}`;
            const column = state.columns[dayId] || {
              id: dayId,
              title: daysOfWeek[date.getDay()],
              taskIds: [],
            };
            const tasks = column.taskIds.map((taskId) => state.tasks[taskId]).filter(Boolean);
            const isToday = today.toDateString() === date.toDateString();
            const cellClasses = `${styles.dayColumn} ${isToday ? styles.today : ''}`;
            const formattedDate = formatDay(date);
            // const formatMonth = formatMonth(date);
            
            return (
              <>
              <Title>{column.title}</Title>
              <div className={styles.weekGrid}>
              <div key={dayId} className={cellClasses}>
                <div className={styles.weekColumn}>
                <Title>{formattedDate}</Title>
                </div>

                <TaskInput onAddTask={(content: string) => addTask(dayId, content)} />
                <Droppable droppableId={dayId}>
                  {(provided) => (
                    <div className={styles.column} {...provided.droppableProps} ref={provided.innerRef}>
                      {tasks.map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
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
              </div>
              </>
            );
          })}
        </div>
      </DragDropContext>
    </Container>
  );
};

export default WeekView;
