import  { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEvents } from '../../contexts/EventContext';
import { useAuth } from '../../contexts/AuthContext';
import EventForm from '../../components/events/EventForm';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import { AlertTriangle } from 'lucide-react';

const EditEvent: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getEventWithStats, updateEvent, deleteEvent } = useEvents();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
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
          onClick={() => navigate('/organizer/events')} 
          className="mt-4 text-blue-600 hover:text-blue-800"
        >
          Go back to events
        </button>
      </div>
    );
  }
  
  // Check if the user is the organizer of this event
  if (!user || user.id !== event.organizerId) {
    return (
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl font-semibold text-gray-900">Access Denied</h2>
        <p className="mt-2 text-gray-600">You don't have permission to edit this event.</p>
        <button 
          onClick={() => navigate(-1)} 
          className="mt-4 text-blue-600 hover:text-blue-800"
        >
          Go back
        </button>
      </div>
    );
  }
  
  interface EventData {
    title: string;
    description: string;
    date: string;
    location: string;
    capacity: number;
  }

  const handleUpdateEvent = async (data: EventData) => {
    setIsLoading(true);
    
    try {
      await updateEvent(eventId, data);
      navigate(`/events/${eventId}`);
    } catch (error) {
      console.error('Error updating event:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeleteEvent = async () => {
    setIsDeleting(true);
    
    try {
      await deleteEvent(eventId);
      navigate('/organizer/events');
    } catch (error) {
      console.error('Error deleting event:', error);
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <div className="sticky top-10">
            <h1 className="text-2xl font-bold text-gray-900">Edit Event</h1>
            <p className="mt-2 text-sm text-gray-600">
              Update the details for your event. All fields marked with * are required.
            </p>
            
            <div className="mt-6 space-y-3">
              <Button
                variant="primary"
                fullWidth
                onClick={() => navigate(`/events/${eventId}`)}
              >
                View Event
              </Button>
              <Button
                variant="danger"
                fullWidth
                onClick={() => setIsDeleteModalOpen(true)}
              >
                Delete Event
              </Button>
            </div>
            
            <div className="mt-6 bg-blue-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-blue-800">Event Stats</h3>
              <div className="mt-2 text-sm text-blue-700">
                <div className="mb-1">
                  <span className="font-medium">Registrations:</span> {event.registrations} / {event.capacity}
                </div>
                <div className="mb-1">
                  <span className="font-medium">Engagement Score:</span> {event.engagementScore}%
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-5 md:mt-0 md:col-span-2">
          <div className="bg-white shadow-sm rounded-lg px-4 py-5 sm:p-6">
            <EventForm
              initialData={event}
              onSubmit={handleUpdateEvent}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Event"
        size="md"
      >
        <div className="flex items-center justify-center mb-4">
          <div className="bg-red-100 rounded-full p-3">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
        </div>
        <p className="text-gray-700 mb-4 text-center">
          Are you sure you want to delete this event? This action cannot be undone.
        </p>
        <p className="text-sm text-gray-500 mb-6 text-center">
          All registrations and feedback associated with this event will also be removed.
        </p>
        <div className="flex justify-end space-x-3">
          <Button
            variant="outline"
            onClick={() => setIsDeleteModalOpen(false)}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleDeleteEvent}
            isLoading={isDeleting}
          >
            Delete Event
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default EditEvent;