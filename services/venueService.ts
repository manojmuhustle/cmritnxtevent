import { Venue } from '../types';
import { dispatchDataChangeEvent } from './db';

const VENUES_KEY = 'cmr_nxt_venues';

export const getVenues = (): Venue[] => {
    const venues = localStorage.getItem(VENUES_KEY);
    return venues ? JSON.parse(venues) : [];
};

export const addVenue = (name: string): Venue => {
    const venues = getVenues();
    const newVenue: Venue = {
        id: `v${Date.now()}`,
        name,
    };
    const updatedVenues = [...venues, newVenue];
    localStorage.setItem(VENUES_KEY, JSON.stringify(updatedVenues));
    dispatchDataChangeEvent();
    return newVenue;
};

export const updateVenue = (id: string, name: string): Venue | undefined => {
    const venues = getVenues();
    const venueIndex = venues.findIndex(v => v.id === id);
    if (venueIndex === -1) {
        return undefined;
    }
    venues[venueIndex].name = name;
    localStorage.setItem(VENUES_KEY, JSON.stringify(venues));
    dispatchDataChangeEvent();
    return venues[venueIndex];
};

export const deleteVenue = (id: string): void => {
    const venues = getVenues();
    const updatedVenues = venues.filter(v => v.id !== id);
    localStorage.setItem(VENUES_KEY, JSON.stringify(updatedVenues));
    dispatchDataChangeEvent();
};