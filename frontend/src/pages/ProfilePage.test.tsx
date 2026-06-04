import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { vi } from 'vitest';
import * as engineersApi from '../api/engineers';
import * as skillsApi from '../api/skills';
import ProfilePage from './ProfilePage';

vi.mock('../api/engineers');
vi.mock('../api/skills');

const engineer = {
  id: 'e1',
  name: 'Alice',
  team: 'Platform',
  role: 'Engineer',
  skillLevels: { s1: 3 }
};

const skills = [{ id: 's1', name: 'React', category: 'Frontend', targetLevel: 4 }];

describe('ProfilePage', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(engineersApi.getEngineer).mockResolvedValue(engineer);
    vi.mocked(skillsApi.getSkills).mockResolvedValue(skills);
    vi.mocked(engineersApi.updateSkillLevels).mockResolvedValue({ ...engineer, skillLevels: { s1: 5 } });
  });

  const renderPage = () =>
    render(
      <MemoryRouter initialEntries={['/engineers/e1']}>
        <Routes>
          <Route path="/engineers/:id" element={<ProfilePage />} />
        </Routes>
      </MemoryRouter>
    );

  it('renders the profile and skills', async () => {
    renderPage();

    await waitFor(() => expect(screen.getByText('Alice')).toBeInTheDocument());
    expect(screen.getByText('React')).toBeInTheDocument();
  });

  it('updates skill levels', async () => {
    renderPage();

    await waitFor(() => expect(screen.getByTestId('profile-skill-s1')).toBeInTheDocument());
    fireEvent.change(screen.getByTestId('profile-skill-s1'), { target: { value: '5' } });
    fireEvent.click(screen.getByTestId('save-profile-button'));

    await waitFor(() => expect(engineersApi.updateSkillLevels).toHaveBeenCalledWith('e1', { s1: 5 }));
  });
});
