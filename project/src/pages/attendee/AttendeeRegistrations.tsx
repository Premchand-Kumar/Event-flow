
import { useEvents } from '../../contexts/EventContext';
import { useAuth } from '../../contexts/AuthContext';
import EventCard from '../../components/events/EventCard';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';

const AttendeeRegistrations: React.FC = () => {
  const { user } = useAuth();
  const { getRegisteredEvents } = useEvents();
  
  if (!user) {
    return <div>Please log in to view your registrations</div>;
  }
  
  const registeredEvents = getRegisteredEvents(user.id);
  
  // Sort events by date (upcoming first)
  const sortedEvents = [...registeredEvents].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Registrations</h1>
      
      {sortedEvents.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedEvents.map(event => (
            <EventCard 
              key={event.id} 
              event={event} 
              isRegistered={true}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-2">You haven't registered for any events yet</h3>
          <p className="text-gray-500 mb-6">Browse available events and register for ones that interest you.</p>
          <Link to="/attendee/events">
            <Button variant="primary">
              Browse Events
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default AttendeeRegistrations;