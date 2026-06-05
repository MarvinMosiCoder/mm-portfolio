// App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Content from './Components/Content';
import AnotherProjects from './Components/AnotherProjects';
import ResumePage from "./Components/ResumePage";
import LoadingGate from './Components/LoadingGate';

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
            </Routes>
          </div>
        </Router>
      </LoadingGate>
    </div>
  );
};

export default App;
