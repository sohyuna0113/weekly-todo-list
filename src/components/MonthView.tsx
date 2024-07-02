import React from 'react';
import { AppState } from '../types/types';
import styles from '../MonthView.module.css';

interface MonthViewProps {
    state: AppState;
    onWeekClick: (weekId: string) => void;
}

const MonthView: React.FC<MonthViewProps> = ({ state, onWeekClick }) => {
    
    const weeks = Array(4).fill(null).map((_, index) => `column-${index + 1}`);

    return (
        <div>
            <h1> Month View </h1>
            <div className={styles.grid}>
        {weeks.map((weekId, index) => (
          <div key={index} className={styles.cell} onClick={() => onWeekClick(weekId)}>
            <h2>{`Week ${index + 1}`}</h2>
          </div>
        ))}
      </div>
        </div>
    )
};

export default MonthView;