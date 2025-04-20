import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEvents } from '../../contexts/EventContext';
import { useAuth } from '../../contexts/AuthContext';
import EventForm from '../../components/events/EventForm';

const CreateEvent: React.FC = () => {
  const { user } = useAuth();
  const { createEvent } = useEvents();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  if (!user || user.role !== 'organizer') {
    return <div>Access denied. This page is for organizers only.</div>;
  }
  
  interface EventData {
    title: string;
    description: string;
    date: string;
    location: string;
    capacity: number;
    image?: string;
  }

  const handleCreateEvent = async (data: EventData) => {
    setIsLoading(true);
    
    try {
      const createdEvent = await createEvent({
        ...data,
        organizerId: user.id
      });
      
      // Navigate to the event detail page
      navigate(`/events/${createdEvent.id}`);
    } catch (error) {
      console.error('Error creating event:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <div className="sticky top-10">
            <h1 className="text-2xl font-bold text-gray-900">Create New Event</h1>
            <p className="mt-2 text-sm text-gray-600">
              Fill in the details for your new event. All fields marked with * are required.
            </p>
            
            <div className="mt-5 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-medium text-gray-900 mb-3">Tips for great events:</h2>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Use a clear, descriptive title</li>
                <li>• Include all important details in the description</li>
                <li>• Be specific about location and time</li>
                <li>• Set a realistic capacity for your venue</li>
                <li>• Add an image to make your event stand out</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-5 md:mt-0 md:col-span-2">
          <div className="bg-white shadow-sm rounded-lg px-4 py-5 sm:p-6">
            <EventForm
              initialData={{ organizerId: user.id }}
              onSubmit={handleCreateEvent}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;