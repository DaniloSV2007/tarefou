export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate?: string; // Optional, as it can be 'no_due_date'
  assignedTo: string;
  completed: boolean;
}
