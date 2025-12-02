import React, { useState } from 'react';
import { useData } from '../hooks/useData';
import { EventStatus, EnrichedEvent, Event } from '../types';
import { approveEvent, deleteEvent } from '../services/eventService';
import VenueManager from '../components/VenueManager';
import Modal from '../components/Modal';
import EventForm from '../components/EventForm';

const AdminDashboard: React.FC = () => {
    const { events } = useData();
    const [showFormModal, setShowFormModal] = useState(false);
    const [editingEvent, setEditingEvent] = useState<Event | null>(null);

    const pendingEvents = events.filter(e => e.status === EventStatus.PENDING);
    const approvedEvents = events.filter(e => e.status === EventStatus.APPROVED);
    const rejectedEvents = events.filter(e => e.status === EventStatus.REJECTED);
    
    const handleApproval = (eventId: string, isApproved: boolean) => {
        approveEvent(eventId, isApproved);
    };

    const handleEdit = (event: Event) => {
        setEditingEvent(event);
        setShowFormModal(true);
    };

    const handleDelete = (eventId: string) => {
        if (window.confirm('Are you sure you want to permanently delete this event? This action cannot be undone.')) {
            deleteEvent(eventId);
        }
    };

    const handleFormClose = () => {
        setShowFormModal(false);
        setEditingEvent(null);
    }

    const EventTable: React.FC<{ title: string, events: EnrichedEvent[] }> = ({ title, events }) => (
        <div>
            <h2 className="text-2xl font-bold text-white mb-4">{title} ({events.length})</h2>
            {events.length > 0 ? (
                <div className="bg-white/5 border border-white/10 rounded-xl shadow-lg overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-300">
                        <thead className="text-xs text-white uppercase bg-white/10">
                            <tr>
                                <th scope="col" className="px-6 py-3">Event</th>
                                <th scope="col" className="px-6 py-3">Organizer</th>
                                <th scope="col" className="px-6 py-3">Date & Venue</th>
                                <th scope="col" className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {events.map(event => (
                                <tr key={event.id} className="border-b border-white/10 hover:bg-white/5">
                                    <td className="px-6 py-4 font-medium text-white">{event.title}</td>
                                    <td className="px-6 py-4">{event.organizerEmail}</td>
                                    <td className="px-6 py-4">{event.date} at {event.venue.name}</td>
                                    <td className="px-6 py-4 flex flex-wrap gap-2">
                                        {event.status === EventStatus.PENDING && (
                                            <>
                                                <button onClick={() => handleApproval(event.id, true)} className="bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-3 rounded text-xs">Approve</button>
                                                <button onClick={() => handleApproval(event.id, false)} className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-1 px-3 rounded text-xs">Reject</button>
                                            </>
                                        )}
                                        <button onClick={() => handleEdit(event)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-xs">Edit</button>
                                        <button onClick={() => handleDelete(event.id)} className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-xs">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : <p className="text-gray-400">No events in this category.</p>}
        </div>
    );

    return (
        <div className="space-y-10">
            <h1 className="text-4xl font-extrabold text-white">Admin Dashboard</h1>
            
            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <EventTable title="Pending Approval" events={pendingEvents} />
                    <EventTable title="Approved Events" events={approvedEvents} />
                    <EventTable title="Rejected Events" events={rejectedEvents} />
                </div>
                <div className="lg:col-span-1">
                    <VenueManager />
                </div>
            </div>

            {showFormModal && (
                <Modal onClose={handleFormClose}>
                    <EventForm eventToEdit={editingEvent} onFormSubmit={handleFormClose} />
                </Modal>
            )}
        </div>
    );
};

export default AdminDashboard;