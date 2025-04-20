import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, User, UserPlus } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'attendee' | 'organizer'>('attendee');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const success = await register(email, name, role);
      
      if (success) {
        // Redirect based on user role
        if (role === 'organizer') {
          navigate('/organizer/events');
        } else {
          navigate('/attendee/events');
        }
      } else {
        setError('This email is already in use');
      }
    } catch (err) {
      setError('An error occurred during registration');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
            sign in to your existing account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <Input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              label="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              icon={<User className="h-5 w-5 text-gray-400" />}
              required
            />

            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              label="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="h-5 w-5 text-gray-400" />}
              required
            />

            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account type
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="role"
                    value="attendee"
                    checked={role === 'attendee'}
                    onChange={() => setRole('attendee')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">Attendee</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="role"
                    value="organizer"
                    checked={role === 'organizer'}
                    onChange={() => setRole('organizer')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">Organizer</span>
                </label>
              </div>
            </div>
            
            <div>
              <Button
                type="submit"
                variant="primary"
                size="md"
                fullWidth
                isLoading={isLoading}
                icon={<UserPlus className="h-5 w-5" />}
              >
                Create account
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;