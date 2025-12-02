import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useData } from '../hooks/useData';
import { EnrichedEvent, Event, EventStatus } from '../types';
import EventForm from '../components/EventForm';
import Modal from '../components/Modal';
import { deleteEvent } from '../services/eventService';
import PlusCircleIcon from '../components/icons/PlusCircleIcon';

const MyEvents: React.FC<{ setPage: (page: 'home') => void }> = ({ setPage }) => {
    const { user } = useAuth();
    const { events } = useData();
    const [showForm, setShowForm] = useState(false);
    const [editingEvent, setEditingEvent] = useState<Event | null>(null);
    const [viewingAttendees, setViewingAttendees] = useState<EnrichedEvent | null>(null);

    const myEvents = events.filter(e => e.organizerEmail === user?.email).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const handleEdit = (event: Event) => {
        setEditingEvent(event);
        setShowForm(true);
    };

    const handleDelete = (eventId: string) => {
        if (window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
            deleteEvent(eventId);
        }
    };
    
    const handleFormClose = () => {
        setShowForm(false);
        setEditingEvent(null);
    }

    const getStatusChip = (status: EventStatus) => {
        switch (status) {
            case EventStatus.APPROVED: return <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-200">Approved</span>;
            case EventStatus.PENDING: return <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-yellow-600 bg-yellow-200">Pending</span>;
            case EventStatus.REJECTED: return <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-red-600 bg-red-200">Rejected</span>;
            default: return null;
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">My Organized Events</h1>
                <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-bold py-2 px-4 rounded-lg hover:from-brand-secondary hover:to-brand-primary transition-all duration-300 transform hover:scale-105 shadow-lg">
                    <PlusCircleIcon className="w-5 h-5"/>
                    Create New Event
                </button>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl shadow-lg overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-300">
                    <thead className="text-xs text-white uppercase bg-white/10">
                        <tr>
                            <th scope="col" className="px-6 py-3">Title</th>
                            <th scope="col" className="px-6 py-3">Date & Time Range</th>
                            <th scope="col" className="px-6 py-3">Venue</th>
                            <th scope="col" className="px-6 py-3">Attendees</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {myEvents.map(event => (
                            <tr key={event.id} className="border-b border-white/10 hover:bg-white/5">
                                <td className="px-6 py-4 font-medium text-white">{event.title}</td>
                                <td className="px-6 py-4">{event.date} ({event.startTime} - {event.endTime})</td>
                                <td className="px-6 py-4">{event.venue.name}</td>
                                <td className="px-6 py-4">
                                    <button onClick={() => setViewingAttendees(event)} className="text-brand-accent hover:underline">
                                        {event.attendees.length} / {event.maxAttendees}
                                    </button>
                                </td>
                                <td className="px-6 py-4">{getStatusChip(event.status)}</td>
                                <td className="px-6 py-4 flex space-x-2">
                                    <button onClick={() => handleEdit(event)} className="font-medium text-blue-400 hover:underline">Edit</button>
                                    <button onClick={() => handleDelete(event.id)} className="font-medium text-red-400 hover:underline">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {myEvents.length === 0 && <p className="text-center p-6 text-gray-400">You haven't organized any events yet.</p>}
            </div>

            {showForm && (
                <Modal onClose={handleFormClose}>
                    <EventForm eventToEdit={editingEvent} onFormSubmit={handleFormClose} />
                </Modal>
            )}
            
            {viewingAttendees && (
                <Modal onClose={() => setViewingAttendees(null)}>
                    <h2 className="text-2xl font-bold text-white mb-4">Attendees for {viewingAttendees.title}</h2>
                    {viewingAttendees.attendees.length > 0 ? (
                       <div className="max-h-96 overflow-y-auto">
                           <table className="w-full text-sm text-left text-gray-300">
                               <thead className="text-xs text-white uppercase bg-white/10 sticky top-0">
                                   <tr>
                                       <th scope="col" className="px-4 py-2">Name</th>
                                       <th scope="col" className="px-4 py-2">Email</th>
                                       <th scope="col" className="px-4 py-2">Year</th>
                                       <th scope="col" className="px-4 py-2">Dept</th>
                                       <th scope="col" className="px-4 py-2">Sec</th>
                                   </tr>
                               </thead>
                               <tbody>
                                   {viewingAttendees.attendees.map(attendee => (
                                       <tr key={attendee.email} className="border-b border-white/10">
                                           <td className="px-4 py-2 font-medium text-white">{attendee.name}</td>
                                           <td className="px-4 py-2">{attendee.email}</td>
                                           <td className="px-4 py-2">{attendee.year}</td>
                                           <td className="px-4 py-2">{attendee.department}</td>
                                           <td className="px-4 py-2">{attendee.section}</td>
                                       </tr>
                                   ))}
                               </tbody>
                           </table>
                       </div>
                    ) : <p className="text-gray-400">No one has registered for this event yet.</p>}
                </Modal>
            )}
        </div>
    );
};

export default MyEvents;