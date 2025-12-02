import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useData } from '../hooks/useData';
import PlusCircleIcon from '../components/icons/PlusCircleIcon';
import CalendarIcon from '../components/icons/CalendarIcon';
import UsersIcon from '../components/icons/UsersIcon';

type Page = 'home' | 'events' | 'my-events' | 'upcoming-events' | 'admin';

const HomePage: React.FC<{ setPage: (page: Page) => void }> = ({ setPage }) => {
    const { user } = useAuth();
    const { events } = useData();

    const userRegisteredEvents = events.filter(e => e.attendees.some(a => a.email === user?.email) && new Date(e.date) >= new Date()).length;

    return (
        <div className="space-y-12">
            <section className="text-center p-8 bg-white/5 rounded-2xl shadow-lg border border-white/10">
                <h1 className="text-4xl md:text-5xl font-extrabold text-white"><span className="text-brand-accent">CMR</span> NXT</h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-300">The central hub for all events at CMRIT. Discover, organize, and experience campus life like never before.</p>
            </section>
            
            <section className="grid md:grid-cols-3 gap-6 text-center">
                 <div onClick={() => setPage('my-events')} className="bg-gradient-to-br from-purple-600/50 to-indigo-600/50 p-6 rounded-xl border border-white/10 hover:border-white/30 hover:scale-105 transition-transform duration-300 cursor-pointer shadow-lg">
                    <PlusCircleIcon className="w-12 h-12 mx-auto text-brand-accent mb-3" />
                    <h3 className="text-xl font-bold text-white">Organize an Event</h3>
                    <p className="text-gray-300 mt-1">Bring your ideas to life and create the next big event on campus.</p>
                </div>
                 <div onClick={() => setPage('events')} className="bg-gradient-to-br from-pink-600/50 to-purple-600/50 p-6 rounded-xl border border-white/10 hover:border-white/30 hover:scale-105 transition-transform duration-300 cursor-pointer shadow-lg">
                    <CalendarIcon className="w-12 h-12 mx-auto text-brand-accent mb-3" />
                    <h3 className="text-xl font-bold text-white">Explore All Events</h3>
                    <p className="text-gray-300 mt-1">Browse the full calendar of upcoming and past events.</p>
                </div>
                 <div onClick={() => setPage('upcoming-events')} className="bg-gradient-to-br from-indigo-600/50 to-blue-600/50 p-6 rounded-xl border border-white/10 hover:border-white/30 hover:scale-105 transition-transform duration-300 cursor-pointer shadow-lg">
                    <UsersIcon className="w-12 h-12 mx-auto text-brand-accent mb-3" />
                    <h3 className="text-xl font-bold text-white">Your Events ({userRegisteredEvents})</h3>
                    <p className="text-gray-300 mt-1">See all the events you've registered for and manage your schedule.</p>
                </div>
            </section>

        </div>
    );
};

export default HomePage;