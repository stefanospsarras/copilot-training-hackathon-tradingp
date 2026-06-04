import { FormEvent, useEffect, useMemo, useState } from 'react';
import { createSkill, deleteSkill, getSkills, updateSkill } from '../api/skills';
import { Skill } from '../api/types';

type SkillDraft = Omit<Skill, 'id'>;

const emptyDraft: SkillDraft = { name: '', category: '', targetLevel: 3 };

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [draft, setDraft] = useState<SkillDraft>(emptyDraft);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingDraft, setEditingDraft] = useState<SkillDraft>(emptyDraft);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void loadSkills();
  }, []);

  const sortedSkills = useMemo(
    () => [...skills].sort((left, right) => left.category.localeCompare(right.category) || left.name.localeCompare(right.name)),
    [skills]
  );

  const loadSkills = async () => {
    try {
      setLoading(true);
      setSkills(await getSkills());
      setError(null);
    } catch (loadError) {
      setError((loadError as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const created = await createSkill(draft);
      setSkills((current) => [...current, created]);
      setDraft(emptyDraft);
      setError(null);
    } catch (createError) {
      setError((createError as Error).message);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteSkill(id);
      setSkills((current) => current.filter((skill) => skill.id !== id));
    } catch (deleteError) {
      setError((deleteError as Error).message);
    }
  };

  const startEditing = (skill: Skill) => {
    setEditingId(skill.id);
    setEditingDraft({ name: skill.name, category: skill.category, targetLevel: skill.targetLevel });
  };

  const handleUpdate = async (id: string) => {
    try {
      const updated = await updateSkill(id, editingDraft);
      setSkills((current) => current.map((skill) => (skill.id === id ? updated : skill)));
      setEditingId(null);
      setError(null);
    } catch (updateError) {
      setError((updateError as Error).message);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Skills Inventory</h1>
          <p>Track target competency levels for the organization.</p>
        </div>
      </div>

      {error && <p className="error-text">{error}</p>}
      {loading && <p className="status-text">Loading skills…</p>}

      <section className="card">
        <form className="grid-form" onSubmit={handleCreate}>
          <label>
            Name
            <input
              data-testid="skill-name-input"
              value={draft.name}
              onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))}
              placeholder="e.g. React"
            />
          </label>
          <label>
            Category
            <input
              data-testid="skill-category-input"
              value={draft.category}
              onChange={(event) => setDraft((current) => ({ ...current, category: event.target.value }))}
              placeholder="e.g. Frontend"
            />
          </label>
          <label>
            Target level
            <select
              data-testid="skill-level-input"
              value={draft.targetLevel}
              onChange={(event) =>
                setDraft((current) => ({ ...current, targetLevel: Number(event.target.value) }))
              }
            >
              {[1, 2, 3, 4, 5].map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </label>
          <button className="primary-button" data-testid="add-skill-button" type="submit">
            Add Skill
          </button>
        </form>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Target Level</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedSkills.map((skill) => {
                const isEditing = editingId === skill.id;
                return (
                  <tr key={skill.id} data-testid={`skill-row-${skill.id}`}>
                    <td>
                      {isEditing ? (
                        <input
                          value={editingDraft.name}
                          onChange={(event) =>
                            setEditingDraft((current) => ({ ...current, name: event.target.value }))
                          }
                        />
                      ) : (
                        skill.name
                      )}
                    </td>
                    <td>
                      {isEditing ? (
                        <input
                          value={editingDraft.category}
                          onChange={(event) =>
                            setEditingDraft((current) => ({ ...current, category: event.target.value }))
                          }
                        />
                      ) : (
                        skill.category
                      )}
                    </td>
                    <td>
                      {isEditing ? (
                        <select
                          value={editingDraft.targetLevel}
                          onChange={(event) =>
                            setEditingDraft((current) => ({ ...current, targetLevel: Number(event.target.value) }))
                          }
                        >
                          {[1, 2, 3, 4, 5].map((level) => (
                            <option key={level} value={level}>
                              {level}
                            </option>
                          ))}
                        </select>
                      ) : (
                        skill.targetLevel
                      )}
                    </td>
                    <td>
                      <div className="actions">
                        {isEditing ? (
                          <>
                            <button className="primary-button" type="button" onClick={() => void handleUpdate(skill.id)}>
                              Save
                            </button>
                            <button className="secondary-button" type="button" onClick={() => setEditingId(null)}>
                              Cancel
                            </button>
                          </>
                        ) : (
                          <button className="secondary-button" type="button" onClick={() => startEditing(skill)}>
                            Edit
                          </button>
                        )}
                        <button
                          className="danger-button"
                          data-testid={`delete-skill-${skill.id}`}
                          type="button"
                          onClick={() => void handleDelete(skill.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
