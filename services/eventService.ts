import { Event, EventStatus, EnrichedEvent, Venue, User, Role, Attendee } from '../types';
import { getVenues } from './venueService';
import { dispatchDataChangeEvent } from './db';

const EVENTS_KEY = 'cmr_nxt_events';

export const getEvents = (): Event[] => {
    const events = localStorage.getItem(EVENTS_KEY);
    return events ? JSON.parse(events) : [];
};

export const getEnrichedEvents = (): EnrichedEvent[] => {
    const events = getEvents();
    const venues = getVenues();
    const venueMap = new Map<string, Venue>(venues.map(v => [v.id, v]));

    return events.map(event => ({
        ...event,
        venue: venueMap.get(event.venueId) || { id: event.venueId, name: 'Unknown Venue' }
    }));
};

export const createEvent = (eventData: Omit<Event, 'id' | 'status' | 'attendees'>, user: User): Event => {
    const events = getEvents();
    const status = user.role === Role.ADMIN ? EventStatus.APPROVED : EventStatus.PENDING;
    
    const newEvent: Event = {
        ...eventData,
        id: `e${Date.now()}`,
        status: status,
        attendees: [],
    };
    const updatedEvents = [...events, newEvent];
    localStorage.setItem(EVENTS_KEY, JSON.stringify(updatedEvents));
    dispatchDataChangeEvent();
    return newEvent;
};

export const updateEvent = (updatedEventData: Event): Event => {
    let events = getEvents();
    events = events.map(event => event.id === updatedEventData.id ? updatedEventData : event);
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
    dispatchDataChangeEvent();
    return updatedEventData;
}

export const deleteEvent = (eventId: string): void => {
    let events = getEvents();
    events = events.filter(event => event.id !== eventId);
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
    dispatchDataChangeEvent();
}

export const approveEvent = (eventId: string, approve: boolean): void => {
    const events = getEvents();
    const event = events.find(e => e.id === eventId);
    if (event) {
        event.status = approve ? EventStatus.APPROVED : EventStatus.REJECTED;
        localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
        dispatchDataChangeEvent();
    }
};

// Helper to convert HH:MM to minutes from midnight
const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
};


export const checkConflict = (date: string, startTime: string, endTime: string, venueId: string, excludeEventId?: string): boolean => {
    const events = getEvents().filter(e => 
        e.id !== excludeEventId && 
        e.status !== EventStatus.REJECTED && 
        e.date === date && 
        e.venueId === venueId
    );

    const newStartTime = timeToMinutes(startTime);
    const newEndTime = timeToMinutes(endTime);

    if (newStartTime >= newEndTime) {
        return true; // Invalid time range
    }

    for (const event of events) {
        const existingStartTime = timeToMinutes(event.startTime);
        const existingEndTime = timeToMinutes(event.endTime);

        // Check for overlap: (StartA < EndB) and (EndA > StartB)
        if (newStartTime < existingEndTime && newEndTime > existingStartTime) {
            return true; // Conflict found
        }
    }

    return false; // No conflict
};


export const registerForEvent = (eventId: string, attendee: Attendee): { success: boolean, message: string } => {
    const events = getEvents();
    const event = events.find(e => e.id === eventId);

    if (!event) {
        return { success: false, message: 'Event not found.' };
    }
    if (event.status !== EventStatus.APPROVED) {
        return { success: false, message: 'Event is not approved for registration.' };
    }
    if (event.attendees.some(a => a.email === attendee.email)) {
        return { success: false, message: 'You are already registered for this event.' };
    }
    if (event.attendees.length >= event.maxAttendees) {
        return { success: false, message: 'This event is full.' };
    }

    event.attendees.push(attendee);
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
    dispatchDataChangeEvent();
    return { success: true, message: 'Successfully registered for the event!' };
};

export const unregisterFromEvent = (eventId: string, userEmail: string): { success: boolean, message: string } => {
    const events = getEvents();
    const event = events.find(e => e.id === eventId);
     if (!event) {
        return { success: false, message: 'Event not found.' };
    }
    
    event.attendees = event.attendees.filter(attendee => attendee.email !== userEmail);
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
    dispatchDataChangeEvent();
    return { success: true, message: 'Successfully unregistered from the event.' };
}