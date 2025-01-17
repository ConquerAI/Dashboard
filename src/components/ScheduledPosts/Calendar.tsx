import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../utils/cn';
import { CalendarUtils } from './CalendarUtils';

interface CalendarProps {
  onDateSelect?: (date: Date) => void;
}

export function Calendar({ onDateSelect }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;

  const getDaysInMonth = (year: number, month: number) => {
    const lastDay = new Date(year, month, 0);
    const daysInMonth = lastDay.getDate();
    const firstDayIndex = CalendarUtils.getFirstDayOfMonth(year, month) - 1;
    
    const days: number[] = [];
    
    // Add empty days for padding at start
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(0);
    }
    
    // Add actual days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    // Add empty days at end to complete grid
    while (days.length < 42) {
      days.push(0);
    }
    
    return days;
  };

  const days = getDaysInMonth(year, month);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));
  };

  const handleDateClick = (day: number) => {
    if (onDateSelect && day > 0) {
      const selectedDate = new Date(year, month - 1, day);
      onDateSelect(selectedDate);
    }
  };

  const isToday = (day: number) => {
    const today = new Date();
    return day === today.getDate() && 
           month === today.getMonth() + 1 && 
           year === today.getFullYear();
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={handlePrevMonth}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-semibold">
          {monthNames[month - 1]} {year}
        </h2>
        <button 
          onClick={handleNextMonth}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Day Names */}
        {dayNames.map((name) => (
          <div 
            key={name} 
            className="text-center text-sm font-medium text-gray-500 py-2"
          >
            {name}
          </div>
        ))}

        {/* Calendar Days */}
        {days.map((day, index) => (
          <button
            key={index}
            onClick={() => handleDateClick(day)}
            disabled={day === 0}
            className={cn(
              "h-10 rounded-lg text-sm font-medium transition-colors",
              "hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2",
              day === 0 && "text-gray-300 cursor-not-allowed hover:bg-transparent",
              isToday(day) && "bg-purple-100 text-purple-700 hover:bg-purple-200"
            )}
          >
            {day > 0 ? day : ''}
          </button>
        ))}
      </div>
    </div>
  );
}