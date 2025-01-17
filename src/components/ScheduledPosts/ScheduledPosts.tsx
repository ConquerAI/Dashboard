import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar } from './Calendar';
import { CalendarEvent } from '../../types';
import { fetchCalendarEvents } from '../../services/calendar';

export function ScheduledPosts() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadCalendarEvents = async () => {
    setIsLoading(true);
    try {
      const eventsResponse = await fetchCalendarEvents(new Date());
      if (eventsResponse) {
        setEvents(eventsResponse);
      }
    } catch (e) {
      console.error("Failed to retrieve events:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCalendarEvents();
  }, []);

  return (
    <motion.div
      className="p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h2
        className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Scheduled Posts
      </motion.h2>

      {isLoading ? (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
        </div>
      ) : (
        <>
          <Calendar />
          <div className="mt-8 space-y-4">
            {events.map((event, index) => (
              <div 
                key={event.id || index}
                className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow duration-200"
              >
                <h3 className="font-medium text-gray-900">{event.title}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(event.date).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </motion.div>
  );
}