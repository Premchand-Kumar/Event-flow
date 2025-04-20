import  { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, Clock, Star } from 'lucide-react';
import { useEvents } from '../../contexts/EventContext';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';

const EventDetails: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { getEventWithStats, registerForEvent, unregisterFromEvent, getRegisteredEvents, submitFeedback } = useEvents();
  const { user } = useAuth();
  
  const [isLoading, setIsLoading] = useState(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  
  if (!eventId) {
    return <div>Event not found</div>;
  }
  
  const event = getEventWithStats(eventId);
  if (!event) {
    return (
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl font-semibold text-gray-900">Event not found</h2>
        <p className="mt-2 text-gray-600">The event you're looking for doesn't exist or has been removed.</p>
        <button 
          onClick={() => navigate(-1)} 
          className="mt-4 text-blue-600 hover:text-blue-800"
        >
          Go back
        </button>
      </div>
    );
  }
  
  const isUserAttendee = user?.role === 'attendee';
  const isUserOrganizer = user?.role === 'organizer';
  const isEventOrganizer = user?.id === event.organizerId;
  
  const registeredEvents = user ? getRegisteredEvents(user.id) : [];
  const isRegistered = registeredEvents.some(e => e.id === eventId);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  const handleRegistration = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (isRegistered) {
        await unregisterFromEvent(event.id, user.id);
      } else {
        await registerForEvent(event.id, user.id);
      }
      // Force refresh
      navigate(0);
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleFeedbackSubmit = async () => {
    if (!user) return;
    
    setSubmittingFeedback(true);
    
    try {
      await submitFeedback(event.id, user.id, rating, comment);
      setFeedbackModalOpen(false);
      // Force refresh to show updated feedback
      navigate(0);
    } catch (error) {
      console.error('Feedback submission error:', error);
    } finally {
      setSubmittingFeedback(false);
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {event.imageUrl && (
          <div className="h-64 md:h-96 w-full overflow-hidden">
            <img 
              src={event.imageUrl} 
              alt={event.title} 
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <h1 className="text-3xl font-bold text-gray-900">{event.title}</h1>
            
            {isUserOrganizer && isEventOrganizer && (
              <div className="mt-4 md:mt-0 flex items-center">
                <Star className="w-5 h-5 text-yellow-500 mr-2" />
                <span className="text-gray-700 mr-1">Engagement Score:</span>
                <span className="font-semibold text-blue-600">{event.engagementScore}%</span>
              </div>
            )}
          </div>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center text-gray-600">
              <Calendar className="w-5 h-5 text-blue-600 mr-2" />
              <span>{formatDate(event.date)}</span>
            </div>
            
            <div className="flex items-center text-gray-600">
              <Clock className="w-5 h-5 text-blue-600 mr-2" />
              <span>{formatTime(event.date)}</span>
            </div>
            
            <div className="flex items-center text-gray-600">
              <MapPin className="w-5 h-5 text-blue-600 mr-2" />
              <span>{event.location}</span>
            </div>
          </div>
          
          <div className="mt-4 flex items-center text-gray-600">
            <Users className="w-5 h-5 text-blue-600 mr-2" />
            <span>{event.registrations} people registered • {event.capacity - event.registrations} spots left</span>
          </div>
          
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">About this event</h2>
            <p className="text-gray-700 whitespace-pre-line">{event.description}</p>
          </div>
          
          <div className="mt-8 flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex items-center">
              <div className="mr-3">
                <p className="text-sm text-gray-500">Organized by</p>
                <p className="font-medium text-gray-900">{event.organizer.name}</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              {isUserAttendee && (
                <>
                  <Button
                    variant={isRegistered ? 'outline' : 'primary'}
                    onClick={handleRegistration}
                    isLoading={isLoading}
                  >
                    {isRegistered ? 'Cancel Registration' : 'Register for Event'}
                  </Button>
                  
                  {isRegistered && (
                    <Button
                      variant="secondary"
                      onClick={() => setFeedbackModalOpen(true)}
                    >
                      Provide Feedback
                    </Button>
                  )}
                </>
              )}
              
              {isEventOrganizer && (
                <Button
                  variant="outline"
                  onClick={() => navigate(`/organizer/events/${event.id}/edit`)}
                >
                  Edit Event
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Feedback Modal */}
      <Modal
        isOpen={feedbackModalOpen}
        onClose={() => setFeedbackModalOpen(false)}
        title="Event Feedback"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              How would you rate this event? (1-5)
            </label>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRating(value)}
                  className={`w-10 h-10 rounded-full focus:outline-none ${
                    rating >= value
                      ? 'bg-yellow-400 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Comments
            </label>
            <textarea
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Share your experience..."
            />
          </div>
          
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setFeedbackModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleFeedbackSubmit}
              isLoading={submittingFeedback}
            >
              Submit Feedback
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default EventDetails;