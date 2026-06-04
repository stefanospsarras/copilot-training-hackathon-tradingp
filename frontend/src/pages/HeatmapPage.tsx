import { useEffect, useMemo, useState } from 'react';
import { updateSkillLevels } from '../api/engineers';
import { getHeatmap } from '../api/heatmap';
import { Engineer, Skill } from '../api/types';
import { getGapBackground } from '../utils/gap';

interface EditingCell {
  engineerId: string;
  skillId: string;
}

export default function HeatmapPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [engineers, setEngineers] = useState<Engineer[]>([]);
  const [editingCell, setEditingCell] = useState<EditingCell | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const result = await getHeatmap();
        setSkills(result.skills.sort((left, right) => left.category.localeCompare(right.category) || left.name.localeCompare(right.name)));
        setEngineers(result.engineers.sort((left, right) => left.team.localeCompare(right.team) || left.name.localeCompare(right.name)));
        setError(null);
      } catch (loadError) {
        setError((loadError as Error).message);
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const skillGroups = useMemo(() => {
    const groups: Array<{ category: string; skills: Skill[] }> = [];
    for (const skill of skills) {
      const lastGroup = groups[groups.length - 1];
      if (lastGroup?.category === skill.category) {
        lastGroup.skills.push(skill);
      } else {
        groups.push({ category: skill.category, skills: [skill] });
      }
    }
    return groups;
  }, [skills]);

  const applyLevel = async (engineerId: string, skillId: string, nextLevel: number) => {
    const previous = engineers;
    setEngineers((current) =>
      current.map((engineer) =>
        engineer.id === engineerId
          ? { ...engineer, skillLevels: { ...engineer.skillLevels, [skillId]: nextLevel } }
          : engineer
      )
    );

    try {
      const updated = await updateSkillLevels(engineerId, { [skillId]: nextLevel });
      setEngineers((current) => current.map((engineer) => (engineer.id === engineerId ? updated : engineer)));
      setError(null);
    } catch (saveError) {
      setEngineers(previous);
      setError((saveError as Error).message);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Team Heatmap</h1>
          <p>Click a cell to update an engineer&apos;s competency level inline.</p>
        </div>
      </div>

      {error && <p className="error-text">{error}</p>}
      {loading && <p className="status-text">Loading heatmap…</p>}

      <section className="card table-wrapper">
        <table className="heatmap-table">
          <thead>
            <tr>
              <th className="heatmap-name-cell">Engineer</th>
              {skillGroups.map((group) => (
                <th key={group.category} colSpan={group.skills.length}>
                  {group.category}
                </th>
              ))}
            </tr>
            <tr>
              <th className="heatmap-name-cell">Team / Role</th>
              {skills.map((skill) => (
                <th key={skill.id}>{skill.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {engineers.map((engineer) => (
              <tr key={engineer.id}>
                <td className="heatmap-name-cell">
                  <strong>{engineer.name}</strong>
                  <div style={{ color: '#64748b', fontSize: '0.85rem' }}>
                    {engineer.team} · {engineer.role}
                  </div>
                </td>
                {skills.map((skill) => {
                  const cellKey = `${engineer.id}-${skill.id}`;
                  const isEditing =
                    editingCell?.engineerId === engineer.id && editingCell?.skillId === skill.id;
                  const level = engineer.skillLevels[skill.id];
                  return (
                    <td
                      key={cellKey}
                      className="heatmap-cell"
                      data-testid={`heatmap-cell-${engineer.id}-${skill.id}`}
                      style={{ background: getGapBackground(skill.targetLevel, level) }}
                      onClick={() => setEditingCell({ engineerId: engineer.id, skillId: skill.id })}
                    >
                      {isEditing ? (
                        <select
                          autoFocus
                          data-testid={`heatmap-editor-${engineer.id}-${skill.id}`}
                          value={level ?? 1}
                          onBlur={() => setEditingCell(null)}
                          onChange={(event) => {
                            const nextLevel = Number(event.target.value);
                            setEditingCell(null);
                            void applyLevel(engineer.id, skill.id, nextLevel);
                          }}
                        >
                          {[1, 2, 3, 4, 5].map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      ) : (
                        level ?? '—'
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
