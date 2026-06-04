import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getEngineer } from '../api/engineers';
import { getTrainingRecommendations } from '../api/training';
import { Engineer, TrainingRecommendation } from '../api/types';
import { getGapBackground } from '../utils/gap';

export default function TrainingPage() {
  const { id } = useParams<{ id: string }>();
  const [engineer, setEngineer] = useState<Engineer | null>(null);
  const [recommendations, setRecommendations] = useState<TrainingRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!id) {
        return;
      }

      try {
        setLoading(true);
        const [loadedEngineer, loadedRecommendations] = await Promise.all([
          getEngineer(id),
          getTrainingRecommendations(id)
        ]);
        setEngineer(loadedEngineer);
        setRecommendations(loadedRecommendations);
        setError(null);
      } catch (loadError) {
        setError((loadError as Error).message);
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [id]);

  if (loading) {
    return <p className="status-text">Loading training recommendations…</p>;
  }

  if (error) {
    return <p className="error-text">{error}</p>;
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Training Recommendations</h1>
          <p>{engineer?.name}</p>
        </div>
        <Link className="link-button" to={`/engineers/${id}`}>
          Back to Profile
        </Link>
      </div>

      <section className="card">
        {recommendations.length === 0 ? (
          <p>All tracked skills are at or above target.</p>
        ) : (
          <ol className="list-reset">
            {recommendations.map((recommendation) => (
              <li key={recommendation.skillId} data-testid={`training-${recommendation.skillId}`} style={{ marginBottom: '1rem' }}>
                <strong>{recommendation.skillName}</strong> ({recommendation.category})
                <div>
                  Current level {recommendation.currentLevel} → target {recommendation.targetLevel}{' '}
                  <span
                    className="badge"
                    style={{ background: getGapBackground(recommendation.targetLevel, recommendation.currentLevel) }}
                  >
                    Gap {recommendation.gap}
                  </span>
                </div>
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  );
}
