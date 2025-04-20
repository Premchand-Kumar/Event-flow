import { Event, Registration, Feedback } from '../types';

export const calculateEngagementScore = (
  event: Event,
  registrations: Registration[],
  feedbacks: Feedback[]
): number => {
  // 1. Number of registrations (0-2 points)
  const eventRegistrations = registrations.filter(r => r.eventId === event.id);
  const registrationRate = Math.min(eventRegistrations.length / event.capacity, 1);
  const registrationScore = registrationRate * 2;

  // 2. Attendance confirmation rate (0-2 points)
  const attendedRegistrations = eventRegistrations.filter(r => r.status === 'attended');
  const attendanceRate = eventRegistrations.length > 0 
    ? attendedRegistrations.length / eventRegistrations.length 
    : 0;
  const attendanceScore = attendanceRate * 2;

  // 3. Organizer responsiveness (0-1 point)
  // Mock this with a random value between 0 and 1
  const organizerResponsiveness = Math.random();

  // 4. Attendee feedback (0-1 point)
  const eventFeedbacks = feedbacks.filter(f => f.eventId === event.id);
  const averageRating = eventFeedbacks.length > 0
    ? eventFeedbacks.reduce((sum, f) => sum + f.rating, 0) / eventFeedbacks.length / 5
    : 0;
  const feedbackScore = averageRating;

  // Calculate total score (0-6)
  const totalScore = registrationScore + attendanceScore + organizerResponsiveness + feedbackScore;
  
  // Normalize to 0-100 scale
  return Math.round((totalScore / 6) * 100);
};