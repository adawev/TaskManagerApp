import { Priority, Task } from '../types/task.types';

type Props = {
  task: Task;
  onToggleComplete: (task: Task) => void;
  onPriorityChange: (id: string, priority: Priority) => void;
  onDelete: (id: string) => void;
};

const badgeLabels: Record<Priority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent'
};

export default function TaskItem({ task, onToggleComplete, onPriorityChange, onDelete }: Props) {
  return (
    <article className={`task-item ${task.completed ? 'is-completed' : ''}`}>
      <div className="task-main">
        <button
          type="button"
          className="task-toggle"
          aria-pressed={task.completed}
          onClick={() => onToggleComplete(task)}
        >
          {task.completed ? 'Undo' : 'Done'}
        </button>
        <div>
          <h3>{task.title}</h3>
          {task.description && <p className="muted">{task.description}</p>}
        </div>
      </div>
      <div className="task-controls">
        <span className={`badge badge-${task.priority}`}>{badgeLabels[task.priority]}</span>
        <label className="priority-select">
          <span className="sr-only">Priority</span>
          <select
            value={task.priority}
            onChange={(event) => onPriorityChange(task.id, event.target.value as Priority)}
          >
            {Object.keys(badgeLabels).map((level) => (
              <option key={level} value={level}>
                {badgeLabels[level as Priority]}
              </option>
            ))}
          </select>
        </label>
        <button type="button" className="ghost" onClick={() => onDelete(task.id)}>
          Delete
        </button>
      </div>
    </article>
  );
}
