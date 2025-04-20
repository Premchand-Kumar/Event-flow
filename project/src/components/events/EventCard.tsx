import React, { useState } from 'react';
import { Calendar, MapPin, Users, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EventWithStats, User } from '../../types';
import Button from '../common/Button';
import { useAuth } from '../../contexts/AuthContext';
import { useEvents } from '../../contexts/EventContext';

interface EventCardProps {
  event: EventWithStats;
  isRegistered?: boolean;
}

const EventCard: React.FC<EventCardProps> = ({ event, isRegistered = false }) => {
  const { user } = useAuth();
  const { registerForEvent, unregisterFromEvent } = useEvents();
  const [isLoading, setIsLoading] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState(isRegistered);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleRegistration = async () => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      if (registrationStatus) {
        await unregisterFromEvent(event.id, user.id);
        setRegistrationStatus(false);
      } else {
        await registerForEvent(event.id, user.id);
        setRegistrationStatus(true);
      }
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isUserAttendee = user?.role === 'attendee';
  const isUserOrganizer = user?.role === 'organizer';
  const isEventOrganizer = user?.id === event.organizerId;

  // Determine engagement score color
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg">
      {event.imageUrl && (
        <div className="h-48 overflow-hidden">
          <img 
            src={event.imageUrl} 
            alt={event.title} 
            className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
          />
        </div>
      )}
      
      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.title}</h3>
        
        <div className="mb-4 text-gray-600 text-sm">
          <div className="flex items-center mb-1">
            <Calendar className="w-4 h-4 mr-2 text-blue-600" />
            {formatDate(event.date)}
          </div>
          <div className="flex items-center mb-1">
            <MapPin className="w-4 h-4 mr-2 text-blue-600" />
            {event.location}
          </div>
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-2 text-blue-600" />
            {event.registrations} / {event.capacity} registered
          </div>
        </div>
        
        {(isUserOrganizer || isEventOrganizer) && (
          <div className="mb-3 flex items-center">
            <Star className="w-4 h-4 mr-2 text-yellow-500" />
            <span className="mr-1">Engagement Score:</span>
            <span className={`font-semibold ${getScoreColor(event.engagementScore)}`}>
              {event.engagementScore}%
            </span>
          </div>
        )}
        
        <div className="flex items-center justify-between mt-4">
          <Link 
            to={`/events/${event.id}`} 
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            View Details
          </Link>
          
          {isUserAttendee && (
            <Button
              variant={registrationStatus ? 'outline' : 'primary'}
              size="sm"
              onClick={handleRegistration}
              isLoading={isLoading}
            >
              {registrationStatus ? 'Unregister' : 'Register'}
            </Button>
          )}
          
          {isEventOrganizer && (
            <Link to={`/organizer/events/${event.id}/edit`}>
              <Button variant="outline" size="sm">
                Edit Event
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;