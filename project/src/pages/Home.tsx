// Project: EventFlow
import { Link } from 'react-router-dom';
import { CalendarClock, Users, Award } from 'lucide-react';
import Button from '../components/common/Button';
import { useAuth } from '../contexts/AuthContext';

const Home: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Simplify Event Management
            </h1>
            <p className="mt-6 text-xl max-w-2xl mx-auto">
              EventFlow streamlines the process of planning, organizing, and managing events of any size.
            </p>
            <div className="mt-10 flex justify-center">
              {!user ? (
                <div className="space-x-4">
                  <Link to="/register">
                    <Button variant="primary" size="lg">
                      Get Started
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button variant="outline" size="lg" className="bg-white">
                      Sign In
                    </Button>
                  </Link>
                </div>
              ) : (
                <Link to={user.role === 'organizer' ? '/organizer/events' : '/attendee/events'}>
                  <Button variant="primary" size="lg">
                    Go to Dashboard
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Features section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Everything you need for successful events
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Our platform provides tools for both event organizers and attendees.
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="pt-6">
                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-blue-600 rounded-md shadow-lg">
                        <CalendarClock className="h-6 w-6 text-white" />
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Easy Event Creation</h3>
                    <p className="mt-5 text-base text-gray-500">
                      Create and manage your events with a user-friendly interface. Set dates, locations, and capacity easily.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-indigo-600 rounded-md shadow-lg">
                        <Users className="h-6 w-6 text-white" />
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Attendee Management</h3>
                    <p className="mt-5 text-base text-gray-500">
                      Track registrations, monitor attendance, and engage with attendees before, during, and after events.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-green-600 rounded-md shadow-lg">
                        <Award className="h-6 w-6 text-white" />
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Engagement Scoring</h3>
                    <p className="mt-5 text-base text-gray-500">
                      Analyze event success with our intelligent engagement scoring system that measures attendee interaction.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA section */}
      <div className="bg-blue-700">
        <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white">
            Ready to transform your event management?
          </h2>
          <p className="mt-4 text-lg leading-6 text-blue-200">
            Join event organizers who use EventFlow to create memorable experiences.
          </p>
          <div className="mt-8">
            {!user ? (
              <Link to="/register">
                <Button variant="primary" size="lg" className="bg-white text-blue-700 hover:bg-gray-100">
                  Start Free
                </Button>
              </Link>
            ) : (
              <Link to={user.role === 'organizer' ? '/organizer/create' : '/attendee/events'}>
                <Button variant="primary" size="lg" className="bg-white text-blue-700 hover:bg-gray-100">
                  {user.role === 'organizer' ? 'Create an Event' : 'Browse Events'}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;