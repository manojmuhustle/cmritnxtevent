import React, { useState } from 'react';
import { EnrichedEvent, EventStatus } from '../types';
import CalendarIcon from './icons/CalendarIcon';
import ClockIcon from './icons/ClockIcon';
import LocationIcon from './icons/LocationIcon';
import UsersIcon from './icons/UsersIcon';
import { useAuth } from '../hooks/useAuth';
import { unregisterFromEvent } from '../services/eventService';
import Modal from './Modal';
import RegistrationForm from './RegistrationForm';

const EventCard: React.FC<{ event: EnrichedEvent, onAction?: () => void }> = ({ event, onAction }) => {
    const { user } = useAuth();
    const [showRegistrationModal, setShowRegistrationModal] = useState(false);
    
    const isRegistered = user ? event.attendees.some(a => a.email === user.email) : false;
    const isOrganizer = user ? user.email === event.organizerEmail : false;
    const isFull = event.attendees.length >= event.maxAttendees;
    const isPast = new Date(event.date) < new Date();
    
    const handleUnregister = () => {
         if (!user) return;
        const result = unregisterFromEvent(event.id, user.email);
        alert(result.message);
        if (result.success && onAction) onAction();
    }
    
    const handleRegistrationSuccess = () => {
        setShowRegistrationModal(false);
        if(onAction) onAction();
    }

    const statusBadge = () => {
        if (isPast) return <div className="absolute top-3 right-3 text-xs bg-gray-500 text-white px-2 py-1 rounded-full z-10">Past</div>
        switch (event.status) {
            case EventStatus.PENDING:
                return <div className="absolute top-3 right-3 text-xs bg-yellow-500 text-black px-2 py-1 rounded-full font-semibold z-10">Pending</div>
            case EventStatus.REJECTED:
                return <div className="absolute top-3 right-3 text-xs bg-red-600 text-white px-2 py-1 rounded-full z-10">Rejected</div>
            default:
                return null;
        }
    }

    return (
        <>
            <div className="bg-white/5 border border-white/10 rounded-2xl shadow-lg overflow-hidden flex flex-col transition-all duration-300 hover:shadow-2xl hover:border-white/20 hover:scale-105 relative">
                {statusBadge()}
                <div className="w-full h-40 bg-brand-dark flex items-center justify-center">
                  {event.poster ? (
                      <img src={event.poster} alt={event.title} className="w-full h-full object-contain" />
                  ) : (
                       <div className="w-full h-full bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center">
                          <h2 className="text-2xl font-bold text-white text-center px-2">{event.title}</h2>
                       </div>
                  )}
                </div>
                <div className="p-5 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
                    <p className="text-sm font-semibold text-brand-accent mb-3">{event.department}</p>
                    <p className="text-gray-400 text-sm mb-4 h-10 overflow-hidden [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical]">{event.description}</p>
                    <div className="space-y-2 text-gray-300 text-sm flex-grow">
                        <div className="flex items-center"><CalendarIcon className="w-4 h-4 mr-2 text-brand-accent" /> {new Date(event.date).toDateString()}</div>
                        <div className="flex items-center"><ClockIcon className="w-4 h-4 mr-2 text-brand-accent" /> {event.startTime} - {event.endTime}</div>
                        <div className="flex items-center"><LocationIcon className="w-4 h-4 mr-2 text-brand-accent" /> {event.venue.name}</div>
                        <div className="flex items-center"><UsersIcon className="w-4 h-4 mr-2 text-brand-accent" /> {event.attendees.length} / {event.maxAttendees} registered</div>
                    </div>
                     <div className="mt-4 text-xs text-gray-400">
                        <p>Coordinators: {event.coordinators}</p>
                        <p className="mt-2">Organized by: {event.organizerEmail.split('@')[0]}</p>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/10">
                        {event.status === EventStatus.APPROVED && !isPast && (
                             isOrganizer ? (
                                <div className="text-center font-bold text-brand-accent py-2 rounded-lg bg-white/5">You are the organizer</div>
                             ) : isRegistered ? (
                                 <button onClick={handleUnregister} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">Unregister</button>
                             ) : (
                                 <button onClick={() => setShowRegistrationModal(true)} disabled={isFull} className="w-full bg-brand-primary hover:bg-brand-secondary disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-lg transition-colors">
                                     {isFull ? 'Event Full' : 'Register'}
                                </button>
                             )
                        )}
                    </div>
                </div>
            </div>
            {showRegistrationModal && (
                <Modal onClose={() => setShowRegistrationModal(false)}>
                    <RegistrationForm
                        event={event}
                        onSuccess={handleRegistrationSuccess}
                    />
                </Modal>
            )}
        </>
    );
};

export default EventCard;