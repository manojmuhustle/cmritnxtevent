import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { DataProvider } from './hooks/useData';
import Header from './components/Header';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import AdminDashboard from './pages/AdminDashboard';
import AllEvents from './pages/AllEvents';
import MyEvents from './pages/MyEvents';
import UpcomingEvents from './pages/UpcomingEvents';
import PastRegisteredEvents from './pages/PastRegisteredEvents'; // Import the new page
import { Role } from './types';

type Page = 'home' | 'events' | 'my-events' | 'upcoming-events' | 'past-registered-events' | 'admin';

const PageRenderer: React.FC<{ page: Page; setPage: (page: Page) => void; }> = ({ page, setPage }) => {
  const { user, role } = useAuth();
  
  if (!user) {
    return <AuthPage />;
  }

  switch (page) {
    case 'home':
      return <HomePage setPage={setPage} />;
    case 'events':
      return <AllEvents />;
    case 'my-events':
      return <MyEvents setPage={setPage} />;
    case 'upcoming-events':
      return <UpcomingEvents />;
    case 'past-registered-events': // Add case for the new page
      return <PastRegisteredEvents />;
    case 'admin':
      if (role === Role.ADMIN) {
        return <AdminDashboard />;
      }
      return <HomePage setPage={setPage} />; // Redirect if not admin
    default:
      return <HomePage setPage={setPage} />;
  }
};

const AppContent: React.FC = () => {
    const { user, role } = useAuth();
    const [page, setPage] = useState<Page>('home');

    useEffect(() => {
        if(user) {
            setPage('home');
        }
    }, [user]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 font-sans">
            <Header page={page} setPage={setPage} />
            <main className="container mx-auto px-4 py-8">
                <PageRenderer page={page} setPage={setPage} />
            </main>
        </div>
    );
};


const App: React.FC = () => {
  return (
    <AuthProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </AuthProvider>
  );
};

export default App;