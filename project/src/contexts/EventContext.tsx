import React, { createContext, useContext, useState, useEffect } from 'react';
import { Event, Registration, Feedback, EventWithStats, User } from '../types';
import { events as mockEvents, registrations as mockRegistrations, feedback as mockFeedback, users } from '../mocks/data';
import { calculateEngagementScore } from '../utils/scoring';

interface EventContextType {
  events: Event[];
  registrations: Registration[];
  feedback: Feedback[];
  getEventWithStats: (eventId: string) => EventWithStats | null;
  getEventsForOrganizer: (organizerId: string) => EventWithStats[];
  getEventsForAttendee: (attendeeId: string) => EventWithStats[];
  getRegisteredEvents: (attendeeId: string) => EventWithStats[];
  createEvent: (event: Omit<Event, 'id' | 'createdAt'>) => Promise<Event>;
  updateEvent: (eventId: string, data: Partial<Event>) => Promise<Event | null>;
  deleteEvent: (eventId: string) => Promise<boolean>;
  registerForEvent: (eventId: string, attendeeId: string) => Promise<Registration | null>;
  unregisterFromEvent: (eventId: string, attendeeId: string) => Promise<boolean>;
  submitFeedback: (eventId: string, attendeeId: string, rating: number, comment: string) => Promise<Feedback | null>;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const useEvents = () => {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
};

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [registrations, setRegistrations] = useState<Registration[]>(mockRegistrations);
  const [feedback, setFeedback] = useState<Feedback[]>(mockFeedback);

  const enhanceEventWithStats = (event: Event): EventWithStats => {
    const eventRegistrations = registrations.filter(r => r.eventId === event.id);
    const registrationCount = eventRegistrations.length;
    const attendedCount = eventRegistrations.filter(r => r.status === 'attended').length;
    const attendanceRate = registrationCount > 0 ? attendedCount / registrationCount : 0;
    const organizer = users.find(u => u.id === event.organizerId) as User;
    
    const engagementScore = calculateEngagementScore(event, registrations, feedback);
    
    return {
      ...event,
      registrations: registrationCount,
      attendanceRate,
      organizer,
      engagementScore
    };
  };

  const getEventWithStats = (eventId: string): EventWithStats | null => {
    const event = events.find(e => e.id === eventId);
    if (!event) return null;
    return enhanceEventWithStats(event);
  };

  const getEventsForOrganizer = (organizerId: string): EventWithStats[] => {
    return events
      .filter(event => event.organizerId === organizerId)
      .map(enhanceEventWithStats);
  };

  const getEventsForAttendee = (attendeeId: string): EventWithStats[] => {
    return events.map(enhanceEventWithStats);
  };

  const getRegisteredEvents = (attendeeId: string): EventWithStats[] => {
    const registeredEventIds = registrations
      .filter(r => r.attendeeId === attendeeId && r.status !== 'cancelled')
      .map(r => r.eventId);
    
    return events
      .filter(event => registeredEventIds.includes(event.id))
      .map(enhanceEventWithStats);
  };

  const createEvent = async (event: Omit<Event, 'id' | 'createdAt'>): Promise<Event> => {
    // Mock API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newEvent: Event = {
      ...event,
      id: `event_${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    
    setEvents(currentEvents => [...currentEvents, newEvent]);
    return newEvent;
  };

  const updateEvent = async (eventId: string, data: Partial<Event>): Promise<Event | null> => {
    // Mock API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let updatedEvent: Event | null = null;
    
    setEvents(currentEvents => {
      return currentEvents.map(event => {
        if (event.id === eventId) {
          updatedEvent = { ...event, ...data };
          return updatedEvent;
        }
        return event;
      });
    });
    
    return updatedEvent;
  };

  const deleteEvent = async (eventId: string): Promise<boolean> => {
    // Mock API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setEvents(currentEvents => currentEvents.filter(event => event.id !== eventId));
    
    // Also remove related registrations and feedback
    setRegistrations(currentRegistrations => 
      currentRegistrations.filter(reg => reg.eventId !== eventId));
    
    setFeedback(currentFeedback => 
      currentFeedback.filter(fb => fb.eventId !== eventId));
    
    return true;
  };

  const registerForEvent = async (eventId: string, attendeeId: string): Promise<Registration | null> => {
    // Check if already registered
    const existingRegistration = registrations.find(
      r => r.eventId === eventId && r.attendeeId === attendeeId && r.status !== 'cancelled'
    );
    
    if (existingRegistration) {
      return null;
    }
    
    // Mock API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newRegistration: Registration = {
      id: `reg_${Date.now()}`,
      eventId,
      attendeeId,
      status: 'registered',
      createdAt: new Date().toISOString()
    };
    
    setRegistrations(currentRegistrations => [...currentRegistrations, newRegistration]);
    
    return newRegistration;
  };

  const unregisterFromEvent = async (eventId: string, attendeeId: string): Promise<boolean> => {
    // Mock API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const registrationToUpdate = registrations.find(
      r => r.eventId === eventId && r.attendeeId === attendeeId && r.status !== 'cancelled'
    );
    
    if (!registrationToUpdate) {
      return false;
    }
    
    setRegistrations(currentRegistrations => 
      currentRegistrations.map(reg => {
        if (reg.id === registrationToUpdate.id) {
          return { ...reg, status: 'cancelled' };
        }
        return reg;
      })
    );
    
    return true;
  };

  const submitFeedback = async (
    eventId: string, 
    attendeeId: string, 
    rating: number, 
    comment: string
  ): Promise<Feedback | null> => {
    // Check if already submitted feedback
    const existingFeedback = feedback.find(
      f => f.eventId === eventId && f.attendeeId === attendeeId
    );
    
    if (existingFeedback) {
      return null;
    }
    
    // Mock API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newFeedback: Feedback = {
      id: `feedback_${Date.now()}`,
      eventId,
      attendeeId,
      rating,
      comment,
      createdAt: new Date().toISOString()
    };
    
    setFeedback(currentFeedback => [...currentFeedback, newFeedback]);
    
    return newFeedback;
  };

  return (
    <EventContext.Provider value={{
      events,
      registrations,
      feedback,
      getEventWithStats,
      getEventsForOrganizer,
      getEventsForAttendee,
      getRegisteredEvents,
      createEvent,
      updateEvent,
      deleteEvent,
      registerForEvent,
      unregisterFromEvent,
      submitFeedback
    }}>
      {children}
    </EventContext.Provider>
  );
};