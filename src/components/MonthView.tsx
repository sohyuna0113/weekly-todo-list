import React from 'react';
import { AppState } from '../types/types';

interface MonthViewProps {
    state: AppState;
    onWeekClick: (weekId: string) => void;
}

const MonthView: React.FC<MonthViewProps> = ({ state, onWeekClick }) => {
    return (
        <div>
            <h1> Month View </h1>
            {state.columnOrder.map(columnId => (
                <div key={columnId} onClick={() => onWeekClick(columnId)}>
                    <h2>{state.columns[columnId].title}</h2>
                </div>
            ))}
        </div>
    )
};

export default MonthView;