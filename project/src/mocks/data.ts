import { User, Event, Registration, Feedback } from '../types';

// Mock Users
export const users: User[] = [
  {
    id: '1',
    email: 'organizer@example.com',
    name: 'John Organizer',
    role: 'organizer'
  },
  {
    id: '2',
    email: 'attendee@example.com',
    name: 'Sarah Attendee',
    role: 'attendee'
  },
  {
    id: '3',
    email: 'organizer2@example.com',
    name: 'Mike Event Manager',
    role: 'organizer'
  }
];

// Mock Events
export const events: Event[] = [
  {
    id: '1',
    title: 'Tech Conference 2025',
    description: 'Join us for the biggest tech conference of the year with industry experts and networking opportunities.',
    date: '2025-05-15T09:00:00.000Z',
    location: 'Convention Center, San Francisco',
    capacity: 500,
    organizerId: '1',
    imageUrl: 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    createdAt: '2025-01-10T12:00:00.000Z',
  },
  {
    id: '2',
    title: 'Design Workshop',
    description: 'Learn the latest design trends and improve your skills with hands-on exercises.',
    date: '2025-06-22T10:00:00.000Z',
    location: 'Design Hub, New York',
    capacity: 50,
    organizerId: '1',
    imageUrl: 'https://images.pexels.com/photos/7096/people-woman-coffee-meeting.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    createdAt: '2025-02-05T14:30:00.000Z',
  },
  {
    id: '3',
    title: 'Marketing Summit',
    description: 'Discover cutting-edge marketing strategies from leading industry professionals.',
    date: '2025-07-10T09:30:00.000Z',
    location: 'Business Center, Chicago',
    capacity: 200,
    organizerId: '3',
    imageUrl: 'https://images.pexels.com/photos/3184657/pexels-photo-3184657.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    createdAt: '2025-03-12T10:15:00.000Z',
  }
];

// Mock Registrations
export const registrations: Registration[] = [
  {
    id: '1',
    eventId: '1',
    attendeeId: '2',
    status: 'registered',
    createdAt: '2025-03-15T10:00:00.000Z',
  },
  {
    id: '2',
    eventId: '2',
    attendeeId: '2',
    status: 'registered',
    createdAt: '2025-04-01T09:30:00.000Z',
  }
];

// Mock Feedback
export const feedback: Feedback[] = [
  {
    id: '1',
    eventId: '1',
    attendeeId: '2',
    rating: 4,
    comment: 'Great event, learned a lot!',
    createdAt: '2025-05-16T18:00:00.000Z',
  }
];