import  { useState } from 'react';
import { useEvents } from '../../contexts/EventContext';
import { useAuth } from '../../contexts/AuthContext';
import EventCard from '../../components/events/EventCard';
import { Search } from 'lucide-react';

const AttendeeEvents: React.FC = () => {
  const { user } = useAuth();
  const { getEventsForAttendee } = useEvents();
  const [searchTerm, setSearchTerm] = useState('');
  
  if (!user) {
    return <div>Please log in to view events</div>;
  }
  
  const events = getEventsForAttendee(user.id);
  
  // Filter events based on search term
  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Sort events by date (upcoming first)
  const sortedEvents = [...filteredEvents].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Upcoming Events</h1>
      
      <div className="mb-8">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search events..."
            className="pl-10 py-2 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {sortedEvents.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedEvents.map(event => (
            <EventCard 
              key={event.id} 
              event={event} 
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No events found.</p>
        </div>
      )}
    </div>
  );
};

export default AttendeeEvents;