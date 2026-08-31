import type { Profile } from './profiles';
import type { Cinema } from './cinemas';
import type { Booking } from './bookings';

export type SnackOrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'completed'
  | 'cancelled';

export interface Snack {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  category: string;
  price: number;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface SnackOrderItem {
  id: string;
  snack_order_id: string;
  snack_id: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  created_at: string;
  snack?: Snack;
}

export interface SnackOrder {
  id: string;
  user_id: string;
  cinema_id: string;
  booking_id: string | null;
  order_code: string;
  status: SnackOrderStatus;
  total_amount: number;
  created_at: string;
  updated_at: string;
  profile?: Profile;
  cinema?: Cinema;
  booking?: Booking;
  items?: SnackOrderItem[];
}

export type SnackInsert = Omit<Snack, 'id' | 'created_at' | 'updated_at'>;
export type SnackUpdate = Partial<SnackInsert>;
export type SnackOrderUpdate = Partial<Pick<SnackOrder, 'status' | 'total_amount'>>;

export interface CreateSnackOrderPayload {
  user_id: string;
  cinema_id: string;
  booking_id?: string | null;
  items: Array<{
    snack_id: string;
    quantity: number;
    unit_price: number;
  }>;
  total_amount: number;
}

