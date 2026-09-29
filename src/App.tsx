import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import GenesisPage from './pages/GenesisPage';
import WorkHubPage from './pages/WorkHubPage';
import AdminLogin from './pages/admin/AdminLogin';
import AdminResetPassword from './pages/admin/AdminResetPassword';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProfile from './pages/admin/AdminProfile';
import AdminProfilePhoto from './pages/admin/AdminProfilePhoto';
import AdminIntroduction from './pages/admin/AdminIntroduction';
import AdminAbout from './pages/admin/AdminAbout';
import AdminResume from './pages/admin/AdminResume';
import AdminDigitalTwin from './pages/admin/AdminDigitalTwin';
import AdminNavigation from './pages/admin/AdminNavigation';
import AdminSettings from './pages/admin/AdminSettings';
import AdminSections from './pages/admin/AdminSections';
import {
  AdminProjects,
  AdminCadCae,
  AdminResearch,
  AdminPlc,
  AdminCertifications,
  AdminSkills,
  AdminArticles,
  AdminConnections,
  AdminAiEngineering,
} from './pages/admin/AdminSectorRoutes';
import AdminContact from './pages/admin/AdminContact';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Experience 01: Introduction & Living Digital Twin */}
          <Route path="/" element={<GenesisPage />} />

          {/* Experience 02: Main Portfolio Work Hub */}
          <Route path="/work" element={<WorkHubPage />} />

          {/* Experience 03: Admin Authentication & Protected CMS */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/reset-password" element={<AdminResetPassword />} />

          {/* Protected Administrative CMS Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            {/* Profile & Visual Identity */}
            <Route path="profile" element={<AdminProfile />} />
            <Route path="profile-photo" element={<AdminProfilePhoto />} />
            {/* Page Content Editors */}
            <Route path="introduction" element={<AdminIntroduction />} />
            <Route path="about" element={<AdminAbout />} />
            <Route path="resume" element={<AdminResume />} />
            <Route path="digital-twin" element={<AdminDigitalTwin />} />
            {/* Site Configuration */}
            <Route path="navigation" element={<AdminNavigation />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="sections" element={<AdminSections />} />
            {/* Portfolio Content Sectors */}
            <Route path="projects" element={<AdminProjects />} />
            <Route path="cad-cae" element={<AdminCadCae />} />
            <Route path="research" element={<AdminResearch />} />
            <Route path="plc" element={<AdminPlc />} />
            <Route path="certifications" element={<AdminCertifications />} />
            <Route path="skills" element={<AdminSkills />} />
            <Route path="articles" element={<AdminArticles />} />
            <Route path="connections" element={<AdminConnections />} />
            <Route path="ai-engineering" element={<AdminAiEngineering />} />
            <Route path="contact" element={<AdminContact />} />
          </Route>

          {/* Catch-all redirect to Introduction */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
