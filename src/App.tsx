import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import PublicLayout from './components/layout/PublicLayout';
import { AppLayout } from './components/layout/AppLayout';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { initDemoMode } from './store/authStore';

initDemoMode();

// Public Pages
import Home from './pages/public/Home';
import Features from './pages/public/Features';
import Pricing from './pages/public/Pricing';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import OnboardingWizard from './pages/onboarding/OnboardingWizard';

// App Pages
import Dashboard from './pages/dashboard/Dashboard';
import CaseList from './pages/cases/CaseList';
import CaseDetail from './pages/cases/CaseDetail';
import CustomerList from './pages/customers/CustomerList';
import CustomerDetail from './pages/customers/CustomerDetail';
import CompanyList from './pages/companies/CompanyList';
import CompanyDetail from './pages/companies/CompanyDetail';
import RiskScoring from './pages/risk/RiskScoring';
import AssessmentHistory from './pages/risk/AssessmentHistory';
import EvidenceVault from './pages/evidence/EvidenceVault';
import TemplateLibrary from './pages/templates/TemplateLibrary';
import AlertsModule from './pages/alerts/AlertsModule';
import PeriodicReviews from './pages/periodic-reviews/PeriodicReviews';
import ReportsModule from './pages/reports/ReportsModule';

// Admin / Core Pages
import AdminPanel from './pages/admin/AdminPanel';
import UserProfile from './pages/admin/UserProfile';
import NotFound from './pages/NotFound';

// Simple Auth Guard Logic for MVP state
import { Outlet } from 'react-router-dom';
const AuthGuard = () => {
  const isAuthenticated = true; // Hardcoded true to map MVP demo capabilities. Flip to map robust sessions.
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Outlet />;
};

export default function App() {
  return (
    <ErrorBoundary>
       <Routes>
          {/* Public Topology */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/features" element={<Features />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/about" element={<div className="p-24 text-center font-bold">About - Coming Soon</div>} />
            <Route path="/contact" element={<div className="p-24 text-center font-bold">Contact - Coming Soon</div>} />
            <Route path="/demo" element={<div className="p-24 text-center font-bold">Demo Scheduler - Coming Soon</div>} />
          </Route>

          {/* Auth Pipelines (Unhindered Routing) */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/onboarding" element={<OnboardingWizard />} />

          {/* Protected Main Shell */}
          <Route element={<AuthGuard />}>
            <Route element={<AppLayout />}>
             <Route path="/dashboard" element={<Dashboard />} />

             {/* Case Orchestration */}
             <Route path="/cases" element={<CaseList />} />
             <Route path="/cases/:id" element={<CaseDetail />} />

             {/* Entity Matrix */}
             <Route path="/customers" element={<CustomerList />} />
             <Route path="/customers/:id" element={<CustomerDetail />} />
             <Route path="/companies" element={<CompanyList />} />
             <Route path="/companies/:id" element={<CompanyDetail />} />

             {/* Functional Pillars */}
             <Route path="/risk-scoring" element={<RiskScoring />} />
             <Route path="/risk-scoring/history" element={<AssessmentHistory />} />
             <Route path="/evidence" element={<EvidenceVault />} />
             
             {/* Extended Modules */}
             <Route path="/templates" element={<TemplateLibrary />} />
             <Route path="/alerts" element={<AlertsModule />} />
             <Route path="/periodic-reviews" element={<PeriodicReviews />} />
             <Route path="/reports" element={<ReportsModule />} />

             {/* Administration Subnet */}
             <Route path="/admin/*" element={<AdminPanel />} />
              <Route path="/admin/profile" element={<UserProfile />} />
            </Route>
          </Route>

          {/* Master 404 Fallback */}
          <Route path="*" element={<NotFound />} />
       </Routes>
    </ErrorBoundary>
  );
}
