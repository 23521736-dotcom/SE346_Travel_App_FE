import { type Schedule, type PromotionItem } from '../types/promotion';

export const PromotionData: PromotionItem[] = [
  {
    id: '1',
    title: '20% Off Lunch Menu',
    isActive: true,
    schedule: {
      startDate: 'Oct 10, 2024',
      endDate: 'Oct 30, 2024',
      days: ['M', 'T', 'W', 'T', 'F'],
      startTime: '11:00 AM',
      endTime: '01:00 PM',
      specificTime: true,
    },
  },
  {
    id: '2',
    title: 'Happy Hour 1-for-1',
    isActive: false,
    schedule: {
      startDate: 'Oct 10, 2024',
      endDate: 'Oct 30, 2024',
      days: ['Sa', 'S'],
      startTime: '05:00 PM',
      endTime: '08:00 PM',
      specificTime: true,
    },
  },
];
