
import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { EnrichedEvent, Venue } from '../types';
import { getEnrichedEvents } from '../services/eventService';
import { getVenues } from '../services/venueService';
import { initDB } from '../services/db';

interface DataContextType {
    events: EnrichedEvent[];
    venues: Venue[];
    loading: boolean;
    refreshData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [events, setEvents] = useState<EnrichedEvent[]>([]);
    const [venues, setVenues] = useState<Venue[]>([]);
    const [loading, setLoading] = useState(true);

    const refreshData = useCallback(() => {
        setLoading(true);
        // Simulate async fetch
        setTimeout(() => {
            initDB();
            setEvents(getEnrichedEvents());
            setVenues(getVenues());
            setLoading(false);
        }, 200);
    }, []);

    useEffect(() => {
        refreshData();

        const handleDataChange = () => {
            refreshData();
        };

        window.addEventListener('datachange', handleDataChange);
        // This listens for changes in other tabs
        window.addEventListener('storage', handleDataChange);

        return () => {
            window.removeEventListener('datachange', handleDataChange);
            window.removeEventListener('storage', handleDataChange);
        };
    }, [refreshData]);

    return (
        <DataContext.Provider value={{ events, venues, loading, refreshData }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = (): DataContextType => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};
