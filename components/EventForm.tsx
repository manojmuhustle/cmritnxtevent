import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useData } from '../hooks/useData';
import { Event } from '../types';
import { createEvent, updateEvent, checkConflict } from '../services/eventService';

interface EventFormProps {
    eventToEdit?: Event | null;
    onFormSubmit: () => void;
}

const EventForm: React.FC<EventFormProps> = ({ eventToEdit, onFormSubmit }) => {
    const { user } = useAuth();
    const { venues } = useData();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [venueId, setVenueId] = useState('');
    const [maxAttendees, setMaxAttendees] = useState(50);
    const [poster, setPoster] = useState<string | undefined>(undefined);
    const [coordinators, setCoordinators] = useState('');
    const [department, setDepartment] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (eventToEdit) {
            setTitle(eventToEdit.title);
            setDescription(eventToEdit.description);
            setDate(eventToEdit.date);
            setStartTime(eventToEdit.startTime);
            setEndTime(eventToEdit.endTime);
            setVenueId(eventToEdit.venueId);
            setMaxAttendees(eventToEdit.maxAttendees);
            setPoster(eventToEdit.poster);
            setCoordinators(eventToEdit.coordinators);
            setDepartment(eventToEdit.department);
        }
    }, [eventToEdit]);
    
    const handlePosterUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPoster(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!title || !description || !date || !startTime || !endTime || !venueId || !coordinators || !department) {
            setError('Please fill all required fields.');
            return;
        }

        if (checkConflict(date, startTime, endTime, venueId, eventToEdit?.id)) {
            const venueName = venues.find(v => v.id === venueId)?.name || 'this venue';
            setError(`There is already an event at ${venueName} during this time. Please choose a different slot.`);
            return;
        }

        if (user) {
            const eventData = { title, description, date, startTime, endTime, venueId, maxAttendees, poster, coordinators, department, organizerEmail: user.email };
            if (eventToEdit) {
                 updateEvent({
                    ...eventToEdit,
                    ...eventData
                });
            } else {
                 createEvent(eventData, user);
            }
            onFormSubmit();
        } else {
            setError('You must be logged in to create an event.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 text-white">
            <h2 className="text-2xl font-bold">{eventToEdit ? 'Edit Event' : 'Create New Event'}</h2>
            {error && <div className="bg-red-500/20 text-red-300 p-3 rounded-lg">{error}</div>}
            
            <input type="text" placeholder="Event Title" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-black/20 p-2 rounded border border-white/20" required />
            <textarea placeholder="Event Description" value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-black/20 p-2 rounded border border-white/20 h-24" required />
            <input type="text" placeholder="Department / Club" value={department} onChange={e => setDepartment(e.target.value)} className="w-full bg-black/20 p-2 rounded border border-white/20" required />
            <input type="text" placeholder="Coordinators (comma-separated)" value={coordinators} onChange={e => setCoordinators(e.target.value)} className="w-full bg-black/20 p-2 rounded border border-white/20" required />
            
            <div className="grid grid-cols-3 gap-4">
                <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full bg-black/20 p-2 rounded border border-white/20 col-span-3 sm:col-span-1" required />
                <input type="time" title="Start Time" value={startTime} onChange={e => setStartTime(e.target.value)} className="w-full bg-black/20 p-2 rounded border border-white/20" required />
                <input type="time" title="End Time" value={endTime} onChange={e => setEndTime(e.target.value)} className="w-full bg-black/20 p-2 rounded border border-white/20" required />
            </div>

            <select value={venueId} onChange={e => setVenueId(e.target.value)} className="w-full bg-black/20 p-2 rounded border border-white/20" required>
                <option value="" disabled>Select a Venue</option>
                {venues.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
            </select>
            <div>
                <label>Max Attendees: {maxAttendees}</label>
                <input type="range" min="10" max="500" step="10" value={maxAttendees} onChange={e => setMaxAttendees(Number(e.target.value))} className="w-full" />
            </div>
            <div>
                <label>Event Poster (Optional)</label>
                <input type="file" accept="image/*" onChange={handlePosterUpload} className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-primary file:text-white hover:file:bg-brand-secondary"/>
            </div>
             {poster && <img src={poster} alt="poster preview" className="w-full h-auto object-contain rounded-lg max-h-40"/>}

            <button type="submit" className="w-full bg-brand-primary hover:bg-brand-secondary text-white font-bold py-2 px-4 rounded-lg transition-colors">{eventToEdit ? 'Update Event' : (user?.role === 'ADMIN' ? 'Create Event' : 'Submit for Approval')}</button>
        </form>
    );
};

export default EventForm;