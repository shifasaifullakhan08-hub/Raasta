import React from 'react';
import { useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { LandingPage } from './pages/LandingPage';
import { MapExplorerPage } from './pages/MapExplorerPage';
import { RoadAlertsPage } from './pages/RoadAlertsPage';
import { CheckRoutePage } from './pages/CheckRoutePage';
import { ReportIssuePage } from './pages/ReportIssuePage';
import { CommuterDashboard } from './pages/CommuterDashboard';
import { SavedRoutesPage } from './pages/SavedRoutesPage';
import { AdminCommandCenter } from './pages/AdminCommandCenter';
import { NotificationCenter } from './pages/NotificationCenter';
import { AuthPages } from './pages/AuthPages';
import { StaticPages } from './pages/StaticPages';
import { OnboardingModal } from './components/onboarding/OnboardingModal';

export const AppContent: React.FC = () => {
  const { currentView } = useApp();

  const renderView = () => {
    switch (currentView) {
      case 'landing':
        return <LandingPage />;
      case 'map':
        return <MapExplorerPage />;
      case 'alerts':
        return <RoadAlertsPage />;
      case 'check-route':
        return <CheckRoutePage />;
      case 'report':
        return <ReportIssuePage />;
      case 'dashboard':
        return <CommuterDashboard />;
      case 'routes':
        return <SavedRoutesPage />;
      case 'admin':
        return <AdminCommandCenter />;
      case 'notifications':
        return <NotificationCenter />;
      case 'login':
        return <AuthPages initialMode="login" />;
      case 'signup':
        return <AuthPages initialMode="signup" />;
      case 'how-it-works':
        return <StaticPages type="how-it-works" />;
      case 'about':
        return <StaticPages type="about" />;
      case 'faq':
        return <StaticPages type="faq" />;
      case 'privacy':
        return <StaticPages type="privacy" />;
      case 'settings':
        return <CommuterDashboard />;
      default:
        return <LandingPage />;
    }
  };

  return (
    <div className="min-h-screen bg-brand-darkest text-slate-100 flex flex-col font-sans selection:bg-brand-emerald selection:text-slate-900">
      <Header />
      <main className="flex-1">
        {renderView()}
      </main>
      <Footer />
      <OnboardingModal />
    </div>
  );
};
