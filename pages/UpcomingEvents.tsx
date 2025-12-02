import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useData } from '../hooks/useData';
import EventCard from '../components/EventCard';

const UpcomingEvents: React.FC = () => {
    const { user } = useAuth();
    const { events, loading } = useData();

    const myUpcomingEvents = events
        .filter(event => user && event.attendees.some(a => a.email === user.email) && new Date(event.date) >= new Date())
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">Your Upcoming Events</h1>
            {loading ? (
                <p className="text-center text-gray-400">Loading your events...</p>
            ) : myUpcomingEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {myUpcomingEvents.map(event => (
                        <EventCard key={event.id} event={event} />
                    ))}
                </div>
            ) : (
                <div className="text-center bg-white/10 p-8 rounded-lg">
                    <p className="text-lg text-gray-300">You haven't registered for any upcoming events yet.</p>
                    <p className="text-gray-400 mt-2">Check out the 'All Events' page to find something exciting!</p>
                </div>
            )}
        </div>
    );
};

export default UpcomingEvents;