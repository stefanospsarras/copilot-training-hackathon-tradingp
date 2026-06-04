import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import * as engineersApi from '../api/engineers';
import EngineersPage from './EngineersPage';

vi.mock('../api/engineers');

const engineers = [
  { id: 'e1', name: 'Alice', team: 'Platform', role: 'Engineer', skillLevels: { s1: 3 } },
  { id: 'e2', name: 'Bob', team: 'Growth', role: 'Manager', skillLevels: { s1: 4 } }
];

describe('EngineersPage', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(engineersApi.getEngineers).mockResolvedValue(engineers);
  });

  it('renders engineers', async () => {
    render(
      <BrowserRouter>
        <EngineersPage />
      </BrowserRouter>
    );

    await waitFor(() => expect(screen.getByText('Alice')).toBeInTheDocument());
    expect(screen.getAllByRole('link', { name: 'View Profile' })).toHaveLength(2);
  });

  it('filters by team', async () => {
    render(
      <BrowserRouter>
        <EngineersPage />
      </BrowserRouter>
    );

    await waitFor(() => expect(screen.getByText('Alice')).toBeInTheDocument());
    fireEvent.change(screen.getByTestId('team-filter'), { target: { value: 'Growth' } });

    expect(screen.queryByText('Alice')).not.toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });
});
