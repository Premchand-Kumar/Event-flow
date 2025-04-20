export interface User {
  id: string;
  email: string;
  name: string;
  role: 'attendee' | 'organizer';
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  capacity: number;
  organizerId: string;
  imageUrl?: string;
  createdAt: string;
}

export interface Registration {
  id: string;
  eventId: string;
  attendeeId: string;
  status: 'registered' | 'attended' | 'cancelled';
  createdAt: string;
}

export interface Feedback {
  id: string;
  eventId: string;
  attendeeId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface EventWithStats extends Event {
  registrations: number;
  attendanceRate: number;
  organizer: User;
  engagementScore: number;
}