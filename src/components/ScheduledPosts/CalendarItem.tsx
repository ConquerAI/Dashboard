import React from 'react';

interface CalendarItemProps {
  event: {
    title: string;
    date: string;
  };
}

export const CalendarItem: React.FC<CalendarItemProps> = ({ event }) => {
  return (
    <div className="calendar-item">
      <h3>{event.title}</h3>
      <p>{event.date}</p>
    </div>
  );
};