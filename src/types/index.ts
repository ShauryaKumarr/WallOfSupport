export interface Message {
  id: string;
  username: string;
  message: string;
  location?: string;
  color?: string;
  date: string;
  time: string;
  likes: number;
  timestamp: number;
}

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  variant: ToastVariant;
  title: string;
  message?: string;
}
