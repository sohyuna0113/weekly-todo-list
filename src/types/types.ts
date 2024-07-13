export interface Task {
  id: string;
  content: string;
  completed: boolean;
}

export interface Column {
  id: string;
  title: string;
  taskIds: string[];
}

export interface AppState {
  tasks: {
    [key: string]: Task;
  };
  columns: {
    [key: string]: Column;
  };
  columnOrder: string[];
}
