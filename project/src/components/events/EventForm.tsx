import React, { useState } from 'react';
import { Calendar, MapPin, Users, FileText, Image } from 'lucide-react';
import Input from '../common/Input';
import Button from '../common/Button';
import { Event } from '../../types';

interface EventFormProps {
  initialData?: Partial<Event>;
  onSubmit: (data: Omit<Event, 'id' | 'createdAt'>) => Promise<void>;
  isLoading: boolean;
}

const EventForm: React.FC<EventFormProps> = ({
  initialData = {},
  onSubmit,
  isLoading
}) => {
  const [title, setTitle] = useState(initialData.title || '');
  const [description, setDescription] = useState(initialData.description || '');
  const [date, setDate] = useState(initialData.date 
    ? new Date(initialData.date).toISOString().split('T')[0] 
    : '');
  const [time, setTime] = useState(initialData.date 
    ? new Date(initialData.date).toISOString().split('T')[1].substring(0, 5) 
    : '');
  const [location, setLocation] = useState(initialData.location || '');
  const [capacity, setCapacity] = useState(initialData.capacity?.toString() || '100');
  const [imageUrl, setImageUrl] = useState(initialData.imageUrl || '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!description.trim()) newErrors.description = 'Description is required';
    if (!date) newErrors.date = 'Date is required';
    if (!time) newErrors.time = 'Time is required';
    if (!location.trim()) newErrors.location = 'Location is required';
    
    const capacityNum = parseInt(capacity);
    if (isNaN(capacityNum) || capacityNum <= 0) {
      newErrors.capacity = 'Capacity must be a positive number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    // Combine date and time
    const dateTime = new Date(`${date}T${time}`).toISOString();
    
    await onSubmit({
      title,
      description,
      date: dateTime,
      location,
      capacity: parseInt(capacity),
      organizerId: initialData.organizerId || '',
      imageUrl: imageUrl || undefined
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        id="title"
        label="Event Title"
        placeholder="Enter event title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        error={errors.title}
        icon={<FileText className="h-5 w-5 text-gray-400" />}
        required
      />
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Event Description
        </label>
        <div className="relative">
          <textarea
            id="description"
            rows={4}
            className={`pl-4 pr-4 py-2 border ${
              errors.description ? 'border-red-300' : 'border-gray-300'
            } focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm rounded-md`}
            placeholder="Describe your event"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          id="date"
          type="date"
          label="Event Date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          error={errors.date}
          icon={<Calendar className="h-5 w-5 text-gray-400" />}
          required
        />
        
        <Input
          id="time"
          type="time"
          label="Event Time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          error={errors.time}
          required
        />
      </div>
      
      <Input
        id="location"
        label="Location"
        placeholder="Event venue or address"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        error={errors.location}
        icon={<MapPin className="h-5 w-5 text-gray-400" />}
        required
      />
      
      <Input
        id="capacity"
        type="number"
        label="Capacity"
        placeholder="Maximum number of attendees"
        value={capacity}
        onChange={(e) => setCapacity(e.target.value)}
        error={errors.capacity}
        icon={<Users className="h-5 w-5 text-gray-400" />}
        required
      />
      
      <Input
        id="imageUrl"
        label="Event Image URL (optional)"
        placeholder="Enter an image URL for your event"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        icon={<Image className="h-5 w-5 text-gray-400" />}
      />
      
      <div className="flex justify-end">
        <Button
          type="submit"
          variant="primary"
          size="md"
          isLoading={isLoading}
        >
          {initialData.id ? 'Update Event' : 'Create Event'}
        </Button>
      </div>
    </form>
  );
};

export default EventForm;