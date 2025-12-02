import React, { useState } from 'react';
import { useData } from '../hooks/useData';
import * as venueService from '../services/venueService';
import { Venue } from '../types';

const VenueManager: React.FC = () => {
    const { venues } = useData();
    const [newVenueName, setNewVenueName] = useState('');
    const [error, setError] = useState('');
    const [editingVenueId, setEditingVenueId] = useState<string | null>(null);
    const [editingVenueName, setEditingVenueName] = useState('');

    const handleAddVenue = () => {
        if (!newVenueName.trim()) {
            setError('Venue name cannot be empty.');
            return;
        }
        setError('');
        venueService.addVenue(newVenueName);
        setNewVenueName('');
    };

    const handleDeleteVenue = (id: string) => {
        if (window.confirm('Are you sure you want to delete this venue?')) {
            venueService.deleteVenue(id);
        }
    };
    
    const handleEditClick = (venue: Venue) => {
        setEditingVenueId(venue.id);
        setEditingVenueName(venue.name);
    };

    const handleCancelEdit = () => {
        setEditingVenueId(null);
        setEditingVenueName('');
    };

    const handleSaveEdit = () => {
        if (!editingVenueName.trim()) {
            return; // Or show error
        }
        if (editingVenueId) {
            venueService.updateVenue(editingVenueId, editingVenueName);
            handleCancelEdit();
        }
    };


    return (
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl shadow-lg space-y-4">
            <h3 className="text-2xl font-bold text-white">Manage Venues</h3>
            <div className="space-y-2">
                {venues.map(venue => (
                    <div key={venue.id} className="flex justify-between items-center bg-black/20 p-2 rounded-lg">
                        {editingVenueId === venue.id ? (
                            <input 
                                type="text"
                                value={editingVenueName}
                                onChange={(e) => setEditingVenueName(e.target.value)}
                                className="bg-black/30 p-1 rounded border border-white/20 text-white w-full"
                            />
                        ) : (
                            <span className="text-gray-200">{venue.name}</span>
                        )}
                        
                        <div className="flex items-center space-x-2 ml-2">
                           {editingVenueId === venue.id ? (
                               <>
                                   <button onClick={handleSaveEdit} className="text-green-400 hover:text-green-300 font-bold">Save</button>
                                   <button onClick={handleCancelEdit} className="text-gray-400 hover:text-gray-300 font-bold">Cancel</button>
                               </>
                           ) : (
                               <>
                                   <button onClick={() => handleEditClick(venue)} className="text-blue-400 hover:text-blue-300 font-bold text-sm">Edit</button>
                                   <button onClick={() => handleDeleteVenue(venue.id)} className="text-red-400 hover:text-red-300 font-bold">&times;</button>
                               </>
                           )}
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex flex-col space-y-2 pt-4 border-t border-white/10">
                <input
                    type="text"
                    value={newVenueName}
                    onChange={(e) => setNewVenueName(e.target.value)}
                    placeholder="New venue name"
                    className="w-full bg-black/20 p-2 rounded border border-white/20 text-white"
                />
                {error && <p className="text-red-400 text-xs">{error}</p>}
                <button onClick={handleAddVenue} className="w-full bg-brand-primary hover:bg-brand-secondary text-white font-bold py-2 px-4 rounded-lg transition-colors">
                    Add Venue
                </button>
            </div>
        </div>
    );
};

export default VenueManager;