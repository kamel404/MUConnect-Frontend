import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Resources from './pages/Resources';
import StudyGroups from './pages/StudyGroups';
import Events from './pages/Events';
import Clubs from './pages/Clubs';
import DegreeChart from './pages/DegreeChart';
import Requests from './pages/Requests';
import Profile from './pages/Profile';
import SavedResources from './pages/SavedResources';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Redirect root to dashboard */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      
      {/* Main layout with nested routes */}
      <Route path="/" element={<MainLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="resources" element={<Resources />} />
        <Route path="study-groups" element={<StudyGroups />} />
        <Route path="events" element={<Events />} />
        <Route path="clubs" element={<Clubs />} />
        <Route path="degree-chart" element={<DegreeChart />} />
        <Route path="requests" element={<Requests />} />
        <Route path="profile" element={<Profile />} />
        <Route path="saved-resources" element={<SavedResources />} />
      </Route>
      
      {/* Catch all - redirect to dashboard */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};
