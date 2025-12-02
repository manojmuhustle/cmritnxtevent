
import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Role } from '../types';

type Page = 'home' | 'events' | 'my-events' | 'upcoming-events' | 'past-registered-events' | 'admin';
interface HeaderProps {
    page: Page;
    setPage: (page: Page) => void;
}

const NavLink: React.FC<{
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ isActive, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
      isActive
        ? 'bg-brand-secondary text-white shadow-lg'
        : 'text-gray-300 hover:bg-white/10 hover:text-white'
    }`}
  >
    {children}
  </button>
);

const Header: React.FC<HeaderProps> = ({ page, setPage }) => {
    const { user, role, logout } = useAuth();

    return (
        <header className="bg-brand-dark/50 backdrop-blur-lg sticky top-0 z-50 shadow-lg shadow-black/20">
            <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <h1 className="text-2xl font-extrabold text-white cursor-pointer" onClick={() => setPage('home')}>
                            <span className="text-brand-accent">CMR</span> <span className="text-white">NXT</span>
                        </h1>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            {user && (
                                <>
                                    <NavLink isActive={page === 'home'} onClick={() => setPage('home')}>Home</NavLink>
                                    <NavLink isActive={page === 'events'} onClick={() => setPage('events')}>All Events</NavLink>
                                    <NavLink isActive={page === 'my-events'} onClick={() => setPage('my-events')}>My Organized Events</NavLink>
                                    <NavLink isActive={page === 'upcoming-events'} onClick={() => setPage('upcoming-events')}>Your Upcoming Events</NavLink>
                                    <NavLink isActive={page === 'past-registered-events'} onClick={() => setPage('past-registered-events')}>Past Registered Events</NavLink>
                                    {role === Role.ADMIN && (
                                        <NavLink isActive={page === 'admin'} onClick={() => setPage('admin')}>Admin Dashboard</NavLink>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center">
                        {user ? (
                            <>
                                <span className="text-gray-300 text-sm hidden sm:inline mr-4">{user.email}</span>
                                <button
                                    onClick={logout}
                                    className="bg-brand-primary hover:bg-brand-secondary text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105"
                                >
                                    Logout
                                </button>
                            </>
                        ) : null }
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header;
