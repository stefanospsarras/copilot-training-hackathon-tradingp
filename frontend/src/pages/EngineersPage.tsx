import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getEngineers } from '../api/engineers';
import { Engineer } from '../api/types';

export default function EngineersPage() {
  const [engineers, setEngineers] = useState<Engineer[]>([]);
  const [teamFilter, setTeamFilter] = useState('All');
  const [roleFilter, setRoleFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setEngineers(await getEngineers());
        setError(null);
      } catch (loadError) {
        setError((loadError as Error).message);
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const teams = useMemo(() => ['All', ...new Set(engineers.map((engineer) => engineer.team))], [engineers]);
  const roles = useMemo(() => ['All', ...new Set(engineers.map((engineer) => engineer.role))], [engineers]);

  const filteredEngineers = useMemo(
    () =>
      [...engineers]
        .filter((engineer) => teamFilter === 'All' || engineer.team === teamFilter)
        .filter((engineer) => roleFilter === 'All' || engineer.role === roleFilter)
        .sort((left, right) => left.team.localeCompare(right.team) || left.name.localeCompare(right.name)),
    [engineers, roleFilter, teamFilter]
  );

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Engineer Inventory</h1>
          <p>Browse engineers by team and role, then drill into individual profiles.</p>
        </div>
      </div>

      {error && <p className="error-text">{error}</p>}
      {loading && <p className="status-text">Loading engineers…</p>}

      <section className="card">
        <div className="filter-bar">
          <label>
            Team
            <select
              data-testid="team-filter"
              value={teamFilter}
              onChange={(event) => setTeamFilter(event.target.value)}
            >
              {teams.map((team) => (
                <option key={team} value={team}>
                  {team}
                </option>
              ))}
            </select>
          </label>
          <label>
            Role
            <select
              data-testid="role-filter"
              value={roleFilter}
              onChange={(event) => setRoleFilter(event.target.value)}
            >
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Team</th>
                <th>Role</th>
                <th>Profile</th>
              </tr>
            </thead>
            <tbody>
              {filteredEngineers.map((engineer) => (
                <tr key={engineer.id} data-testid={`engineer-row-${engineer.id}`}>
                  <td>{engineer.name}</td>
                  <td>{engineer.team}</td>
                  <td>{engineer.role}</td>
                  <td>
                    <Link className="link-button" to={`/engineers/${engineer.id}`}>
                      View Profile
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
