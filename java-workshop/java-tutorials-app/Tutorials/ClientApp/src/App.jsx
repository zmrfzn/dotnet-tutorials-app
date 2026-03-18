import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ErrorBoundary } from 'react-error-boundary';

import './App.css';

//stylesheets
import "bootstrap/dist/css/bootstrap.min.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";  //theme
import "primereact/resources/primereact.min.css";                  //core css
import "primeicons/primeicons.css";  

// Layout Components
import MainLayout from './layouts/MainLayout';
import PageLoader from './components/common/PageLoader';
import ErrorFallback from './components/common/ErrorFallback';

// Lazy load components for better performance
const TutorialsList = lazy(() => import("./components/TutorialsList"));
const AddTutorial = lazy(() => import("./components/AddTutorial"));
const Tutorial = lazy(() => import("./components/Tutorial"));
const TutorialView = lazy(() => import("./components/TutorialView"));
const Published = lazy(() => import("./components/Published"));
const PageNotFound = lazy(() => import("./components/PageNotFound"));
const Dashboard = lazy(() => import("./components/Dashboard"));
const Analytics = lazy(() => import("./components/Analytics"));

function App() {
  return (
    <ErrorBoundary 
      FallbackComponent={ErrorFallback}
      onReset={() => window.location.href = '/'}
    >
      <MainLayout>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Navigate to="/tutorials" replace />} />
            <Route path="/tutorials" element={<TutorialsList />} />
            <Route path="/published" element={<Published />} />
            <Route path="/add" element={<AddTutorial />} />
            <Route path="/tutorials/:id" element={<Tutorial />} />
            <Route path="/view/:id" element={<TutorialView />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/404/:id" element={<PageNotFound />}/>
            <Route path="*" element={<PageNotFound />}/>
          </Routes>
        </Suspense>
      </MainLayout>
    </ErrorBoundary>
  );
}

export default App;
