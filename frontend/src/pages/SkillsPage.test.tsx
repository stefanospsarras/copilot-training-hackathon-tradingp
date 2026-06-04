import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import * as skillsApi from '../api/skills';
import SkillsPage from './SkillsPage';

vi.mock('../api/skills');

const mockSkills = [{ id: '1', name: 'TypeScript', category: 'Languages', targetLevel: 4 }];

describe('SkillsPage', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(skillsApi.getSkills).mockResolvedValue(mockSkills);
  });

  it('renders the skill list', async () => {
    render(
      <BrowserRouter>
        <SkillsPage />
      </BrowserRouter>
    );

    await waitFor(() => expect(screen.getByText('TypeScript')).toBeInTheDocument());
  });

  it('creates a skill', async () => {
    vi.mocked(skillsApi.createSkill).mockResolvedValue({
      id: '2',
      name: 'GraphQL',
      category: 'Backend',
      targetLevel: 3
    });

    render(
      <BrowserRouter>
        <SkillsPage />
      </BrowserRouter>
    );

    await waitFor(() => expect(screen.getByText('TypeScript')).toBeInTheDocument());
    fireEvent.change(screen.getByTestId('skill-name-input'), { target: { value: 'GraphQL' } });
    fireEvent.change(screen.getByTestId('skill-category-input'), { target: { value: 'Backend' } });
    fireEvent.click(screen.getByTestId('add-skill-button'));

    await waitFor(() => expect(screen.getByText('GraphQL')).toBeInTheDocument());
    expect(skillsApi.createSkill).toHaveBeenCalledWith({ name: 'GraphQL', category: 'Backend', targetLevel: 3 });
  });

  it('deletes a skill', async () => {
    vi.mocked(skillsApi.deleteSkill).mockResolvedValue(undefined);

    render(
      <BrowserRouter>
        <SkillsPage />
      </BrowserRouter>
    );

    await waitFor(() => expect(screen.getByText('TypeScript')).toBeInTheDocument());
    fireEvent.click(screen.getByTestId('delete-skill-1'));

    await waitFor(() => expect(screen.queryByText('TypeScript')).not.toBeInTheDocument());
  });
});
