export const CalendarUtils = {
  getFirstDayOfMonth: (year: number, month: number): number => {
    const firstDay = new Date(year, month - 1, 1).getDay();
    return firstDay === 0 ? 7 : firstDay; // Convert Sunday from 0 to 7
  }
};