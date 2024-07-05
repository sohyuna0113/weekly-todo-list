import React from 'react';
import { AppState } from '../types/types';
import styles from '../MonthView.module.css';
import theme from '../style/theme';

interface MonthViewProps {
    state: AppState;
    onWeekClick: (weekId: string) => void;
}

const MonthView: React.FC<MonthViewProps> = ({ state, onWeekClick }) => {
    
    const days = Array(30).fill(null).map((_, index) => `column-${index + 1}`);

    return (
        <div style={{ backgroundColor: theme.backgroundColor }}>
            <h1> Month View </h1>
            <div className={styles.grid}>
        {days.map((weekId, index) => (
          <div key={index} className={styles.cell} onClick={() => onWeekClick(weekId)}>
            <h2>{`Day - ${index + 1}`}</h2>
          </div>
        ))}
      </div>
        </div>
    )
};

export default MonthView;