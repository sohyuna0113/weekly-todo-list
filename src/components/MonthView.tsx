import React from 'react';
import styles from '../MonthView.module.css';
import Title from '../style/Title';
import Subtitle from '../style/Subtitle';
import Text from '../style/Text';
import Container from '../style/Container';
import { AppState } from '../types/types';
import { formatDate, getDayOfWeek } from '../utils/dateUtils';

interface MonthViewProps {
  state: AppState;
  onWeekClick: (selectedDate: Date) => void;
}

const MonthView: React.FC<MonthViewProps> = ({ state, onWeekClick }) => {
  const today = new Date();
  const currentDay = getDayOfWeek(today);
  const formattedDate = formatDate(today);

  const daysInMonth = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    0
  ).getDate();
  const days = Array.from(
    { length: daysInMonth },
    (_, index) => `column-${index + 1}`
  );

  return (
    <Container>
      <Title>{currentDay}</Title>
      <Subtitle>{formattedDate}</Subtitle>
      <div className={styles.grid}>
        {days.map((dayId, index) => {
          const dayTasks = state.columns[dayId]?.taskIds.slice(0, 3) || [];
          const isToday = today.getDate() === index + 1;
          const cellClasses = `${styles.cell} ${isToday ? styles.today : ''}`;

          const handleDayClick = () => {
            const selectedDate = new Date(today.getFullYear(), today.getMonth(), index + 1);
            onWeekClick(selectedDate);
          };

          return (
            <div
              key={index}
              className={cellClasses}
              onClick={handleDayClick}
            >
              <Subtitle>{`${index + 1}`}</Subtitle>
              <ul>
                {dayTasks.map((taskId, taskIndex) => (
                  <li key={taskIndex}>
                    <label className={styles.checkboxLabel}>
                      <input type="checkbox" className={styles.checkbox} />
                      <Text>{state.tasks[taskId]?.content}</Text>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </Container>
  );
};

export default MonthView;

