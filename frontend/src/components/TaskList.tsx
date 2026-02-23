import TaskItem from './TaskItem';
import { Priority, Task } from '../types/task.types';

type Props = {
  tasks: Task[];
  onToggleComplete: (task: Task) => void;
  onPriorityChange: (id: string, priority: Priority) => void;
  onDelete: (id: string) => void;
};

export default function TaskList({ tasks, onToggleComplete, onPriorityChange, onDelete }: Props) {
  if (tasks.length === 0) {
    return (
      <section className="panel task-list">
        <p className="empty-state">No tasks found. Add one to get started.</p>
      </section>
    );
  }

  return (
    <section className="panel task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggleComplete={onToggleComplete}
          onPriorityChange={onPriorityChange}
          onDelete={onDelete}
        />
      ))}
    </section>
  );
}
