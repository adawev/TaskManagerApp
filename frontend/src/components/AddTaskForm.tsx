import { FormEvent, useState } from 'react';
import { Priority } from '../types/task.types';

const priorities: Priority[] = ['low', 'medium', 'high', 'urgent'];

type Props = {
  onCreate: (payload: { title: string; description?: string; priority: Priority }) => Promise<void>;
};

export default function AddTaskForm({ onCreate }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [submitting, setSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (title.trim().length === 0) {
      setValidationError('Title is required');
      return;
    }
    setValidationError(null);
    setSubmitting(true);
    try {
      await onCreate({ title: title.trim(), description: description.trim() || undefined, priority });
      setTitle('');
      setDescription('');
      setPriority('medium');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="panel form" onSubmit={handleSubmit}>
      <h2>Add new task</h2>
      <label>
        Title
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="e.g. Finish onboarding"
        />
      </label>
      <label>
        Description
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Optional details"
        />
      </label>
      <label>
        Priority
        <select value={priority} onChange={(event) => setPriority(event.target.value as Priority)}>
          {priorities.map((level) => (
            <option key={level} value={level}>
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </option>
          ))}
        </select>
      </label>
      {validationError && <p className="error-text">{validationError}</p>}
      <button type="submit" className="primary" disabled={submitting}>
        {submitting ? 'Adding…' : 'Add task'}
      </button>
    </form>
  );
}
