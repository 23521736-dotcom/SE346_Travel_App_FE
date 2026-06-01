import { Schedule } from '../types/promotion';

export const getScheduleString = (schedule: Schedule): string => {
  const { startDate, endDate, days, startTime, endTime, specificTime } = schedule;

  const dayMap: { [key: string]: string } = {
    M: 'Mon',
    T: 'Tue',
    W: 'Wed',
    Th: 'Thu',
    F: 'Fri',
    Sa: 'Sat',
    S: 'Sun',
  };

  const daysText = days.map((day) => dayMap[day]).join(', ');
  const timeText = specificTime ? `${startTime} - ${endTime}` : 'All day';

  return `Promotion valid from ${startDate} to ${endDate} on ${daysText} at ${timeText}`;
};

export const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const getTimeValue = (timeStr: string) => {
  if (!timeStr) return 0;
  const [time, modifier] = timeStr.split(' ');
  let [hours, minutes] = time.split(':').map(Number);

  if (modifier === 'PM' && hours < 12) hours += 12;
  if (modifier === 'AM' && hours === 12) hours = 0;

  return hours * 60 + minutes;
};
