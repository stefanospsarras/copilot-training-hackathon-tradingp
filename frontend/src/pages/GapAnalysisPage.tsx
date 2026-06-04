import { useEffect, useState } from 'react';
import { getGapAnalysis } from '../api/gapAnalysis';
import { SkillGap } from '../api/types';
import { getGapBackground } from '../utils/gap';

export default function GapAnalysisPage() {
  const [gaps, setGaps] = useState<SkillGap[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setGaps(await getGapAnalysis());
        setError(null);
      } catch (loadError) {
        setError((loadError as Error).message);
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Gap Analysis</h1>
          <p>See which skills have the biggest gap between target level and the team average.</p>
        </div>
      </div>

      {error && <p className="error-text">{error}</p>}
      {loading && <p className="status-text">Loading gap analysis…</p>}

      <section className="card table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Skill</th>
              <th>Category</th>
              <th>Target</th>
              <th>Average</th>
              <th>Gap</th>
              <th>Visual</th>
            </tr>
          </thead>
          <tbody>
            {gaps.map((gap) => (
              <tr key={gap.skillId} data-testid={`gap-row-${gap.skillId}`}>
                <td>{gap.skillName}</td>
                <td>{gap.category}</td>
                <td>{gap.targetLevel}</td>
                <td>{gap.teamAverage}</td>
                <td>
                  <span className="badge" style={{ background: getGapBackground(gap.targetLevel, gap.teamAverage) }}>
                    {gap.gap}
                  </span>
                </td>
                <td>
                  <div className="progress-track">
                    <div
                      className="progress-bar"
                      style={{
                        width: `${Math.max(0, Math.min(gap.gap, 4)) * 25}%`,
                        background: getGapBackground(gap.targetLevel, gap.teamAverage)
                      }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
