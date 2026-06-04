import { Schedule } from '../types/promotion';

export const parsePromotionDate = (value: string | Date): Date | null => {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  if (!value) return null;

  const parsed = new Date(value);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed;
  }

  const monthMap: { [key: string]: number } = {
    Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
    Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
  };

  const parts = value.replace(',', '').trim().split(/\s+/);
  if (parts.length < 3) return null;

  const monthIndex = monthMap[parts[0]];
  const day = Number(parts[1]);
  const year = Number(parts[2]);

  if (monthIndex === undefined || Number.isNaN(day) || Number.isNaN(year)) {
    return null;
  }

  return new Date(year, monthIndex, day);
};

export const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const formatPromotionDate = (value: string | Date) => {
  const date = parsePromotionDate(value);
  return date ? formatDate(date) : String(value || '');
};

export const toPromotionApiDateTime = (value: string | Date) => {
  const date = parsePromotionDate(value);
  return date ? date.toISOString() : String(value || '');
};

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

  return `Promotion valid from ${formatPromotionDate(startDate)} to ${formatPromotionDate(endDate)} on ${daysText} at ${timeText}`;
};

export const getTimeValue = (timeStr: string) => {
  if (!timeStr) return 0;
  const [time, modifier] = timeStr.split(' ');
  let [hours, minutes] = time.split(':').map(Number);

  if (modifier === 'PM' && hours < 12) hours += 12;
  if (modifier === 'AM' && hours === 12) hours = 0;

  return hours * 60 + minutes;
};
