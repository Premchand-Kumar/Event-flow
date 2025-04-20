import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useEvents } from '../../contexts/EventContext';
import { useAuth } from '../../contexts/AuthContext';
import EventCard from '../../components/events/EventCard';
import { PlusCircle, Search } from 'lucide-react';
import Button from '../../components/common/Button';

const OrganizerEvents: React.FC = () => {
  const { user } = useAuth();
  const { getEventsForOrganizer } = useEvents();
  const [searchTerm, setSearchTerm] = useState('');
  
  if (!user || user.role !== 'organizer') {
    return <div>Access denied. This page is for organizers only.</div>;
  }
  
  const events = getEventsForOrganizer(user.id);
  
  // Filter events based on search term
  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Events</h1>
        <div className="mt-4 md:mt-0">
          <Link to="/organizer/create">
            <Button
              variant="primary"
              icon={<PlusCircle className="h-5 w-5" />}
            >
              Create New Event
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="mb-8">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search your events..."
            className="pl-10 py-2 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          {events.length > 0 ? (
            <p className="text-gray-500">No events match your search.</p>
          ) : (
            <>
              <h3 className="text-lg font-medium text-gray-900 mb-2">You haven't created any events yet</h3>
              <p className="text-gray-500 mb-6">Get started by creating your first event.</p>
              <Link to="/organizer/create">
                <Button
                  variant="primary"
                  icon={<PlusCircle className="h-5 w-5" />}
                >
                  Create Event
                </Button>
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default OrganizerEvents;