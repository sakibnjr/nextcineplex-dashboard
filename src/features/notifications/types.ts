export interface NotificationItem {
  id: string;
  type: 'ticket' | 'snack';
  title: string;
  message: string;
  time: string;
  path: string;
  date: Date;
}
