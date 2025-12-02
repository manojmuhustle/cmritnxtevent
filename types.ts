export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export interface User {
  email: string;
  role: Role;
}

export interface Venue {
  id: string;
  name: string;
}

export enum EventStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export interface Attendee {
  email: string;
  name: string;
  department: string;
  section: string;
  year: string; // "1", "2", "3", "4"
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  venueId: string;
  maxAttendees: number;
  poster?: string; // Base64 encoded image
  organizerEmail: string;
  status: EventStatus;
  attendees: Attendee[]; // list of attendee objects
  coordinators: string; // Comma-separated names
  department: string; // Department or club name
}

export interface EnrichedEvent extends Event {
    venue: Venue;
}