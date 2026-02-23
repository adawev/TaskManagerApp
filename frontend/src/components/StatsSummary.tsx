import { useEffect, useState } from 'react';
import { Priority } from '../types/task.types';
import { fetchStats, Stats } from '../services/taskApi';

const priorityOrder: Priority[] = ['low', 'medium', 'high', 'urgent'];

const priorityLabel = (priority: Priority) => priority.charAt(0).toUpperCase() + priority.slice(1);

export default function StatsSummary({ refreshKey }: { refreshKey: number }) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);
    fetchStats()
      .then((data) => {
        if (isMounted) {
          setStats(data);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError((err as Error).message);
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, [refreshKey]);

  return (
    <section className="panel stats-summary">
      <header>
        <h2>Stats</h2>
        {loading && <p className="subtle">Loading stats…</p>}
        {error && <p className="error-text">{error}</p>}
      </header>
      <div className="stat-grid">
        <article>
          <p className="label">Total</p>
          <p className="value">{stats?.total ?? '—'}</p>
        </article>
        <article>
          <p className="label">Completed</p>
          <p className="value">{stats?.completed ?? '—'}</p>
        </article>
        <article>
          <p className="label">Pending</p>
          <p className="value">{stats?.pending ?? '—'}</p>
        </article>
      </div>
      <div className="priority-grid">
        {priorityOrder.map((priority) => (
          <article key={priority}>
            <p className="label">{priorityLabel(priority)}</p>
            <p className="value">{stats ? stats.byPriority[priority] : '—'}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
