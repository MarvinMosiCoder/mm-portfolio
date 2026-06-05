// App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Content from './Components/Content';
import AnotherProjects from './Components/AnotherProjects';
import SecurityForm from './Middleware/SecurityForm';
import UploadFile from './pages/UploadFile';
import ProtectedRoute from './Middleware/ProtectedRoute';
import ResumePage from "./Components/ResumePage";
import LoadingGate from './Components/LoadingGate';
import Dashboard from './pages/Dashboard';
import { AuthProvider } from './context/AuthContext';
import OverviewPage from './pages/OverviewPage';
import AddResumeData from './pages/AddResumeData';
import ProfileForm from './pages/ResumeDataForm/ProfileForm';

const RouteWithMeta: React.FC<{ element: React.ReactNode; title: string }> = ({ element, title }) => {
  React.useEffect(() => {
    document.title = title;
  }, [title]);
  return <>{element}</>;
};

const mockLoader = async () => {
  await new Promise((res) => setTimeout(res, 1200));
};

const App: React.FC = () => {
  return (
    <div className="overflow-x-hidden">
      <AuthProvider>
        <LoadingGate loader={mockLoader} minDurationMs={800}>
          <Router>
            <div className="max-w-full min-h-screen">
              <Routes>
                <Route
                  path="/"
                  element={<RouteWithMeta element={<Content />} title="Home | Marvin Mosico" />}
                />
                <Route
                  path="/other-projects"
                  element={<RouteWithMeta element={<AnotherProjects />} title="Other Projects | Marvin Mosico" />}
                />
                <Route
                  path="/resume"
                  element={<RouteWithMeta element={<ResumePage />} title="Resume | Marvin Mosico" />}
                />
                {/* This route is now the login page */}
                <Route
                  path="/admin"
                  element={<RouteWithMeta element={<SecurityForm />} title="Login | Marvin Mosico" />}
                />
                <Route
                  path="/dashboard"
                  element={
                    <RouteWithMeta
                      element={<ProtectedRoute element={<Dashboard />} />}
                      title="Dashboard | Marvin Mosico"
                    />
                  }
                >
                  <Route index element={<OverviewPage />} />
                  <Route path="upload-file" element={<UploadFile />} />
                  <Route path="resume-data" element={<AddResumeData />} 
                  >
                    <Route path="profile-form" element={<ProfileForm />} />
                    <Route path="experience-form" element={<ProfileForm />} />
                  </Route>
                </Route>
              </Routes>
            </div>
          </Router>
        </LoadingGate>
      </AuthProvider>
    </div>
  );
};

export default App;
