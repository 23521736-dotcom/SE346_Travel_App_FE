export interface Schedule {
  startDate: string;
  endDate: string;
  days: string[];
  startTime: string;
  endTime: string;
  specificTime: boolean;
}

export interface PromotionItem {
  id: string;
  title: string;
  isActive: boolean;
  schedule: Schedule;
}
