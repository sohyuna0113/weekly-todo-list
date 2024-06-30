import React, {useState} from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import styles from '../App.module.css';

import { AppState, Task, Column } from '../types/types';
import TaskInput from './TaskInput';

interface WeekViewProps {
    state: AppState;
    setState: React.Dispatch<React.SetStateAction<AppState>>;
    weekId: string;
}

const WeekView: React.FC<WeekViewProps> = ({ state, setState, weekId }) => {
    const column = state.columns[weekId];
    const tasks = column.taskIds.map(taskId => state.tasks[taskId]);

    const onDragEnd = (result: DropResult) => {
        const { destination, source, draggableId } = result;

        if (!destination) {
            return;
        }

        if (destination.droppableId === source.droppableId && destination.index === source.index) {
            return;
        }

        const newTaskIds = Array.from(column.taskIds);
        newTaskIds.splice(source.index, 1);
        newTaskIds.splice(destination.index, 0, draggableId);

        const newColumn = {
            ...column,
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
    }

    const addTask = (content: string) => {
        const newTaskId = `task-${Date.now()}`;
        const newTask: Task = { id: newTaskId, content };
        const newColumn = {
          ...column,
          taskIds: [...column.taskIds, newTaskId],
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
          <h1>{column.title}</h1>
          <TaskInput onAddTask={addTask} />
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId={column.id}>
              {provided => (
                <div className={styles.column} {...provided.droppableProps} ref={provided.innerRef}>
                  {tasks.map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {provided => (
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
          </DragDropContext>
        </div>
      );
}

export default WeekView;