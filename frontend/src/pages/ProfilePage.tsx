import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getEngineer, updateSkillLevels } from '../api/engineers';
import { getSkills } from '../api/skills';
import { Engineer, Skill } from '../api/types';
import { getGap, getGapBackground } from '../utils/gap';

export default function ProfilePage() {
  const { id } = useParams<{ id: string }>();
  const [engineer, setEngineer] = useState<Engineer | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [levels, setLevels] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!id) {
        return;
      }

      try {
        setLoading(true);
        const [loadedEngineer, loadedSkills] = await Promise.all([getEngineer(id), getSkills()]);
        setEngineer(loadedEngineer);
        setSkills(loadedSkills.sort((left, right) => left.category.localeCompare(right.category) || left.name.localeCompare(right.name)));
        setLevels(loadedEngineer.skillLevels);
        setError(null);
      } catch (loadError) {
        setError((loadError as Error).message);
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [id]);

  const rows = useMemo(
    () =>
      skills.map((skill) => ({
        skill,
        currentLevel: levels[skill.id],
        gap: getGap(skill.targetLevel, levels[skill.id])
      })),
    [levels, skills]
  );

  const handleSave = async () => {
    if (!id) {
      return;
    }

    try {
      setSaving(true);
      const updated = await updateSkillLevels(id, levels);
      setEngineer(updated);
      setLevels(updated.skillLevels);
      setError(null);
    } catch (saveError) {
      setError((saveError as Error).message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="status-text">Loading engineer profile…</p>;
  }

  if (error && !engineer) {
    return <p className="error-text">{error}</p>;
  }

  if (!engineer) {
    return <p className="error-text">Engineer not found.</p>;
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>{engineer.name}</h1>
          <p>
            {engineer.team} · {engineer.role}
          </p>
        </div>
        <Link className="link-button" to={`/engineers/${engineer.id}/training`}>
          View Training Recommendations
        </Link>
      </div>

      {error && <p className="error-text">{error}</p>}

      <section className="card">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Skill</th>
                <th>Category</th>
                <th>Current Level</th>
                <th>Target Level</th>
                <th>Gap</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ skill, currentLevel, gap }) => (
                <tr key={skill.id} data-testid={`profile-row-${skill.id}`}>
                  <td>{skill.name}</td>
                  <td>{skill.category}</td>
                  <td>
                    <select
                      data-testid={`profile-skill-${skill.id}`}
                      value={currentLevel ?? 1}
                      onChange={(event) =>
                        setLevels((current) => ({ ...current, [skill.id]: Number(event.target.value) }))
                      }
                    >
                      {[1, 2, 3, 4, 5].map((level) => (
                        <option key={level} value={level}>
                          {level}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>{skill.targetLevel}</td>
                  <td>
                    <span
                      className="badge"
                      style={{ background: getGapBackground(skill.targetLevel, currentLevel), color: '#0f172a' }}
                    >
                      {gap ?? 'N/A'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: '1rem' }}>
          <button className="primary-button" data-testid="save-profile-button" disabled={saving} onClick={() => void handleSave()}>
            {saving ? 'Saving…' : 'Save Skill Levels'}
          </button>
        </div>
      </section>
    </div>
  );
}
