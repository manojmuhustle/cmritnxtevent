import { Venue, Event, EventStatus, Attendee } from '../types';

const USERS_KEY = 'cmr_nxt_users';
const VENUES_KEY = 'cmr_nxt_venues';
const EVENTS_KEY = 'cmr_nxt_events';

export const initDB = () => {
    if (!localStorage.getItem(USERS_KEY)) {
        localStorage.setItem(USERS_KEY, JSON.stringify({}));
    }

    if (!localStorage.getItem(VENUES_KEY)) {
        const initialVenues: Venue[] = [
            { id: 'v1', name: 'Main Auditorium' },
            { id: 'v2', name: 'Seminar Hall 1' },
            { id: 'v3', name: 'Amphitheatre' },
            { id: 'v4', name: 'Sports Ground' },
        ];
        localStorage.setItem(VENUES_KEY, JSON.stringify(initialVenues));
    }

    if (!localStorage.getItem(EVENTS_KEY)) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const nextWeek = new Date(today);
        nextWeek.setDate(nextWeek.getDate() + 7);
        const pastDate = new Date(today);
        pastDate.setDate(pastDate.getDate() - 3);


        const initialEvents: Event[] = [
            {
                id: 'e1',
                title: 'Tech Fest 2024',
                description: 'The biggest annual tech festival. Join us for coding competitions, robotics workshops, and expert talks.',
                date: nextWeek.toISOString().split('T')[0],
                startTime: '10:00',
                endTime: '17:00',
                venueId: 'v1',
                maxAttendees: 200,
                organizerEmail: 'organizer@cmrit.ac.in',
                status: EventStatus.APPROVED,
                attendees: [{ email: 'user1@cmrit.ac.in', name: 'Test User', department: 'CSE', section: 'A', year: '3' }],
                poster: 'https://picsum.photos/seed/techfest/800/400',
                coordinators: 'John Doe, Jane Smith',
                department: 'CSE Department'
            },
             {
                id: 'e2',
                title: 'Annual Sports Day',
                description: 'Compete in various sports and cheer for your friends. A day full of energy and sportsmanship.',
                date: tomorrow.toISOString().split('T')[0],
                startTime: '09:00',
                endTime: '16:00',
                venueId: 'v4',
                maxAttendees: 500,
                organizerEmail: 'sports@cmrit.ac.in',
                status: EventStatus.APPROVED,
                attendees: [],
                coordinators: 'Coach Carter',
                department: 'Sports Club'
            },
            {
                id: 'e3',
                title: 'Guest Lecture on AI',
                description: 'An insightful session on the future of Artificial Intelligence by a renowned expert in the field.',
                date: tomorrow.toISOString().split('T')[0],
                startTime: '14:00',
                endTime: '15:30',
                venueId: 'v2',
                maxAttendees: 50,
                organizerEmail: 'organizer@cmrit.ac.in',
                status: EventStatus.PENDING,
                attendees: [],
                coordinators: 'Dr. Alan Turing',
                department: 'AI Research Wing'
            },
            {
                id: 'e4',
                title: 'Alumni Meet',
                description: 'Reconnect with old friends and network with fellow alumni. A nostalgic evening of memories and fun.',
                date: pastDate.toISOString().split('T')[0],
                startTime: '18:00',
                endTime: '20:00',
                venueId: 'v3',
                maxAttendees: 150,
                organizerEmail: 'alumni@cmrit.ac.in',
                status: EventStatus.APPROVED,
                attendees: [
                    { email: 'user1@cmrit.ac.in', name: 'Test User', department: 'CSE', section: 'A', year: '3' },
                    { email: 'user2@cmrit.ac.in', name: 'Another User', department: 'ECE', section: 'B', year: '4' }
                ],
                poster: 'https://picsum.photos/seed/alumni/800/400',
                coordinators: 'Alumni Association',
                department: 'Alumni Cell'
            },
        ];
        localStorage.setItem(EVENTS_KEY, JSON.stringify(initialEvents));
    }
};

// Custom event to notify other tabs/components of data changes
export const dispatchDataChangeEvent = () => {
    window.dispatchEvent(new Event('datachange'));
};