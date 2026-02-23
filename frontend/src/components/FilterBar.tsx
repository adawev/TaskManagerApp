import { Priority } from '../types/task.types';

const priorities: Priority[] = ['low', 'medium', 'high', 'urgent'];

type CompletionFilter = 'all' | 'completed' | 'pending';

type Props = {
  priorityFilter: 'all' | Priority;
  completedFilter: CompletionFilter;
  onPriorityChange: (value: 'all' | Priority) => void;
  onCompletedChange: (value: CompletionFilter) => void;
};

export default function FilterBar({
  priorityFilter,
  completedFilter,
  onPriorityChange,
  onCompletedChange
}: Props) {
  return (
    <section className="filter-bar">
      <div className="filter-field">
        <label htmlFor="priority-filter">Priority</label>
        <select
          id="priority-filter"
          className="filter-select"
          value={priorityFilter}
          onChange={(event) => onPriorityChange(event.target.value as 'all' | Priority)}
        >
          <option value="all">All</option>
          {priorities.map((level) => (
            <option key={level} value={level}>
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </option>
          ))}
        </select>
      </div>
      <div className="filter-field">
        <label htmlFor="status-filter">Status</label>
        <select
          id="status-filter"
          className="filter-select"
          value={completedFilter}
          onChange={(event) => onCompletedChange(event.target.value as CompletionFilter)}
        >
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
        </select>
      </div>
    </section>
  );
}
