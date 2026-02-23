import { useCallback, useEffect, useMemo, useState } from 'react';
import '@fontsource/space-grotesk/400.css';
import '@fontsource/space-grotesk/600.css';
import AddTaskForm from './components/AddTaskForm';
import FilterBar from './components/FilterBar';
import StatsSummary from './components/StatsSummary';
import TaskList from './components/TaskList';
import { Priority } from './types/task.types';
import { TaskFilters, useTaskApi } from './hooks/useTaskApi';

type CompletionFilter = 'all' | 'completed' | 'pending';

function App() {
  const { tasks, loading, error, fetchTasks, createTask, updateTask, deleteTask } = useTaskApi();
  const [priorityFilter, setPriorityFilter] = useState<'all' | Priority>('all');
  const [completedFilter, setCompletedFilter] = useState<CompletionFilter>('all');
  const [operationError, setOperationError] = useState<string | null>(null);
  const [statsKey, setStatsKey] = useState(0);
  const [showAddForm, setShowAddForm] = useState(false);

  const filters = useMemo<TaskFilters>(() => {
    const current: TaskFilters = {};
    if (priorityFilter !== 'all') {
      current.priority = priorityFilter;
    }
    if (completedFilter === 'completed') {
      current.completed = true;
    } else if (completedFilter === 'pending') {
      current.completed = false;
    }
    return current;
  }, [priorityFilter, completedFilter]);

  useEffect(() => {
    let mounted = true;
    fetchTasks(filters)
      .then(() => {
        if (mounted) {
          setStatsKey((key) => key + 1);
        }
      })
      .catch((err) => {
        if (mounted) {
          setOperationError((err as Error).message);
        }
      });
    return () => {
      mounted = false;
    };
  }, [fetchTasks, filters]);

  const bumpStats = useCallback(() => setStatsKey((key) => key + 1), []);

  const handleAddTask = useCallback(
    async (payload: { title: string; description?: string; priority: Priority }) => {
      setOperationError(null);
      try {
        await createTask(payload);
        bumpStats();
      } catch (err) {
        setOperationError((err as Error).message);
      }
    },
    [createTask, bumpStats]
  );

  const handleToggle = useCallback(
    async (task: { id: string; completed: boolean }) => {
      setOperationError(null);
      try {
        await updateTask(task.id, { completed: !task.completed });
        bumpStats();
      } catch (err) {
        setOperationError((err as Error).message);
      }
    },
    [updateTask, bumpStats]
  );

  const handlePriorityChange = useCallback(
    async (id: string, priority: Priority) => {
      setOperationError(null);
      try {
        await updateTask(id, { priority });
        bumpStats();
      } catch (err) {
        setOperationError((err as Error).message);
      }
    },
    [updateTask, bumpStats]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      const confirmed = window.confirm('Delete this task?');
      if (!confirmed) {
        return;
      }
      setOperationError(null);
      try {
        await deleteTask(id);
        bumpStats();
      } catch (err) {
        setOperationError((err as Error).message);
      }
    },
    [deleteTask, bumpStats]
  );

  return (
    <div className="app-shell">
      <header className="hero">
        <div>
          <p className="eyebrow">Task Manager</p>
          <h1>Manage priorities and stay in flow.</h1>
          <p className="muted">Built on a lightweight React + TS frontend talking to a Node + Express REST API.</p>
        </div>
      </header>
      <StatsSummary refreshKey={statsKey} />

      <div className="filter-section">
        <div className="filter-card">
          <FilterBar
            priorityFilter={priorityFilter}
            completedFilter={completedFilter}
            onPriorityChange={setPriorityFilter}
            onCompletedChange={setCompletedFilter}
          />
          <button type="button" className="primary" onClick={() => setShowAddForm((open) => !open)}>
            {showAddForm ? 'Hide form' : 'Add task'}
          </button>
        </div>
      </div>

      {showAddForm && <AddTaskForm onCreate={handleAddTask} />}

      {operationError && <p className="error-text">{operationError}</p>}

      {loading ? (
        <div className="loading-spinner" aria-live="polite">
          <span />
          <span />
          <span />
        </div>
      ) : (
        <TaskList
          tasks={tasks}
          onToggleComplete={handleToggle}
          onPriorityChange={handlePriorityChange}
          onDelete={handleDelete}
        />
      )}

      {error && !operationError && <p className="error-text">{error}</p>}
    </div>
  );
}

export default App;
