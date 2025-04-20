
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { EventProvider } from './contexts/EventContext';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import AttendeeEvents from './pages/attendee/AttendeeEvents';
import AttendeeRegistrations from './pages/attendee/AttendeeRegistrations';
import OrganizerEvents from './pages/organizer/OrganizerEvents';
import CreateEvent from './pages/organizer/CreateEvent';
import EditEvent from './pages/organizer/EditEvent';
import EventDetails from './pages/events/EventDetails';

// Components
import Navbar from './components/common/Navbar';

function App() {
  return (
    <AuthProvider>
      <EventProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/events/:eventId" element={<EventDetails />} />
                
                {/* Attendee routes */}
                <Route path="/attendee/events" element={<AttendeeEvents />} />
                <Route path="/attendee/my-events" element={<AttendeeRegistrations />} />
                
                {/* Organizer routes */}
                <Route path="/organizer/events" element={<OrganizerEvents />} />
                <Route path="/organizer/create" element={<CreateEvent />} />
                <Route path="/organizer/events/:eventId/edit" element={<EditEvent />} />
                
                {/* Redirect any unknown routes */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <footer className="bg-white shadow-inner py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <p className="text-center text-gray-500 text-sm">
                  © {new Date().getFullYear()} EventFlow. All rights reserved.
                </p>
              </div>
            </footer>
          </div>
        </Router>
      </EventProvider>
    </AuthProvider>
  );
}

export default App;