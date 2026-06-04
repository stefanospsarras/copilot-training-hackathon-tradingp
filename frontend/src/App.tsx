import { BrowserRouter, NavLink, Navigate, Route, Routes } from 'react-router-dom';
import EngineersPage from './pages/EngineersPage';
import GapAnalysisPage from './pages/GapAnalysisPage';
import HeatmapPage from './pages/HeatmapPage';
import ProfilePage from './pages/ProfilePage';
import SkillsPage from './pages/SkillsPage';
import TrainingPage from './pages/TrainingPage';

const navItems = [
  { to: '/engineers', label: 'Engineers' },
  { to: '/skills', label: 'Skills' },
  { to: '/heatmap', label: 'Heatmap' },
  { to: '/gap-analysis', label: 'Gap Analysis' }
];

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <nav className="sidebar">
          <h2 className="sidebar-title">Skills Matrix</h2>
          {navItems.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <main className="content">
          <Routes>
            <Route path="/" element={<Navigate to="/engineers" replace />} />
            <Route path="/skills" element={<SkillsPage />} />
            <Route path="/engineers" element={<EngineersPage />} />
            <Route path="/engineers/:id" element={<ProfilePage />} />
            <Route path="/engineers/:id/training" element={<TrainingPage />} />
            <Route path="/heatmap" element={<HeatmapPage />} />
            <Route path="/gap-analysis" element={<GapAnalysisPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
