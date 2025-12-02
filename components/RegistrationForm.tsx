import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { EnrichedEvent } from '../types';
import { registerForEvent } from '../services/eventService';

interface RegistrationFormProps {
    event: EnrichedEvent;
    onSuccess: () => void;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ event, onSuccess }) => {
    const { user } = useAuth();
    const [name, setName] = useState('');
    const [department, setDepartment] = useState('');
    const [section, setSection] = useState('');
    const [year, setYear] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        if (!name || !department || !section || !year) {
            setError('Please fill out all fields.');
            return;
        }

        if (!user) {
            setError('You must be logged in to register.');
            return;
        }

        const attendee = {
            email: user.email,
            name,
            department,
            section,
            year,
        };

        const result = registerForEvent(event.id, attendee);

        if (result.success) {
            alert(result.message);
            onSuccess();
        } else {
            setError(result.message);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 text-white">
            <h2 className="text-2xl font-bold">Register for {event.title}</h2>
            {error && <div className="bg-red-500/20 text-red-300 p-3 rounded-lg">{error}</div>}
            
            <input 
                type="text" 
                placeholder="Full Name" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                className="w-full bg-black/20 p-2 rounded border border-white/20" 
                required 
            />
            <input 
                type="text" 
                placeholder="Department (e.g., CSE, ISE)" 
                value={department} 
                onChange={e => setDepartment(e.target.value)} 
                className="w-full bg-black/20 p-2 rounded border border-white/20" 
                required 
            />
            <div className="grid grid-cols-2 gap-4">
                <input 
                    type="text" 
                    placeholder="Section" 
                    value={section} 
                    onChange={e => setSection(e.target.value)} 
                    className="w-full bg-black/20 p-2 rounded border border-white/20" 
                    required 
                />
                <select 
                    value={year} 
                    onChange={e => setYear(e.target.value)} 
                    className="w-full bg-black/20 p-2 rounded border border-white/20" 
                    required
                >
                    <option value="" disabled>Select Year</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                </select>
            </div>

            <button 
                type="submit" 
                className="w-full bg-brand-primary hover:bg-brand-secondary text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
                Confirm Registration
            </button>
        </form>
    );
};

export default RegistrationForm;