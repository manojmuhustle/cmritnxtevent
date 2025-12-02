
import React, { useState } from 'react';
import { useData } from '../hooks/useData';
import { EnrichedEvent, EventStatus } from '../types';
import EventCard from '../components/EventCard';
import Calendar from '../components/Calendar';

const AllEvents: React.FC = () => {
    const { events, loading } = useData();
    const [view, setView] = useState<'cards' | 'calendar'>('cards');

    const approvedEvents = events.filter(e => e.status === EventStatus.APPROVED);
    const upcomingEvents = approvedEvents.filter(e => new Date(e.date) >= new Date()).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const pastEvents = approvedEvents.filter(e => new Date(e.date) < new Date()).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">All Events</h1>
                <div className="flex space-x-2 bg-black/20 p-1 rounded-lg">
                    <button onClick={() => setView('cards')} className={`px-4 py-2 rounded-md text-sm font-medium ${view === 'cards' ? 'bg-brand-primary text-white' : 'text-gray-300'}`}>Cards</button>
                    <button onClick={() => setView('calendar')} className={`px-4 py-2 rounded-md text-sm font-medium ${view === 'calendar' ? 'bg-brand-primary text-white' : 'text-gray-300'}`}>Calendar</button>
                </div>
            </div>

            {loading ? <p className="text-center">Loading events...</p> : (
                view === 'cards' ? (
                    <div>
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4 border-b-2 border-brand-accent pb-2">Upcoming Events</h2>
                            {upcomingEvents.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {upcomingEvents.map(event => <EventCard key={event.id} event={event} />)}
                                </div>
                            ) : <p className="text-gray-400">No upcoming events.</p>}
                        </section>
                        <section className="mt-12">
                            <h2 className="text-2xl font-bold text-white mb-4 border-b-2 border-brand-accent pb-2">Past Events</h2>
                            {pastEvents.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 opacity-70">
                                    {pastEvents.map(event => <EventCard key={event.id} event={event} />)}
                                </div>
                            ) : <p className="text-gray-400">No past events.</p>}
                        </section>
                    </div>
                ) : (
                    <Calendar events={approvedEvents} />
                )
            )}
        </div>
    );
};

export default AllEvents;
