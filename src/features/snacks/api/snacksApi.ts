import { supabase } from '../../../lib/supabase';
import type {
  Snack,
  SnackInsert,
  SnackUpdate,
  SnackOrder,
  SnackOrderStatus,
  CreateSnackOrderPayload,
} from '../../../types';

const sanitizePayload = <T extends SnackInsert | SnackUpdate>(payload: T): T => {
  const sanitized = { ...payload };
  for (const key of Object.keys(sanitized) as (keyof T)[]) {
    if (sanitized[key] === '') {
      (sanitized as Record<string, unknown>)[key as string] = null;
    }
  }
  return sanitized;
};

export const getSnacks = async (): Promise<Snack[]> => {
  const { data, error } = await supabase
    .from('snacks')
    .select('*')
    .order('category', { ascending: true })
    .order('name', { ascending: true });

  if (error) throw error;
  return data || [];
};

export const createSnack = async (snack: SnackInsert): Promise<Snack> => {
  const sanitized = sanitizePayload(snack);
  const { data, error } = await supabase
    .from('snacks')
    .insert(sanitized)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateSnack = async (
  id: string,
  updates: SnackUpdate
): Promise<Snack> => {
  const sanitized = sanitizePayload(updates);
  const { data, error } = await supabase
    .from('snacks')
    .update(sanitized)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const toggleSnackAvailability = async (
  id: string,
  is_available: boolean
): Promise<Snack> => {
  const { data, error } = await supabase
    .from('snacks')
    .update({ is_available })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteSnack = async (id: string): Promise<void> => {
  const { error } = await supabase.from('snacks').delete().eq('id', id);
  if (error) throw error;
};

export const getSnackOrders = async (): Promise<SnackOrder[]> => {
  const { data, error } = await supabase
    .from('snack_orders')
    .select(`
      *,
      profile:profiles(*),
      cinema:cinemas(*),
      booking:bookings(*),
      items:snack_order_items(
        *,
        snack:snacks(*)
      )
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const createSnackOrder = async (
  payload: CreateSnackOrderPayload
): Promise<SnackOrder> => {
  const randomSuffix = Math.floor(100000 + Math.random() * 900000);
  const orderCode = `SNK-${randomSuffix}`;

  // 1. Insert master order
  const { data: order, error: orderError } = await supabase
    .from('snack_orders')
    .insert({
      user_id: payload.user_id,
      cinema_id: payload.cinema_id,
      booking_id: payload.booking_id || null,
      order_code: orderCode,
      status: 'pending',
      total_amount: payload.total_amount,
    })
    .select()
    .single();

  if (orderError) throw orderError;

  // 2. Insert items
  if (payload.items.length > 0) {
    const itemsData = payload.items.map((item) => ({
      snack_order_id: order.id,
      snack_id: item.snack_id,
      quantity: item.quantity,
      unit_price: item.unit_price,
      subtotal: item.quantity * item.unit_price,
    }));

    const { error: itemsError } = await supabase
      .from('snack_order_items')
      .insert(itemsData);

    if (itemsError) {
      await supabase.from('snack_orders').delete().eq('id', order.id);
      throw itemsError;
    }
  }

  // 3. Return full order entity
  const { data: fullOrder, error: fetchError } = await supabase
    .from('snack_orders')
    .select(`
      *,
      profile:profiles(*),
      cinema:cinemas(*),
      booking:bookings(*),
      items:snack_order_items(
        *,
        snack:snacks(*)
      )
    `)
    .eq('id', order.id)
    .single();

  if (fetchError) return order;
  return fullOrder;
};

export const updateSnackOrderStatus = async (
  id: string,
  status: SnackOrderStatus
): Promise<SnackOrder> => {
  const { data, error } = await supabase
    .from('snack_orders')
    .update({ status })
    .eq('id', id)
    .select(`
      *,
      profile:profiles(*),
      cinema:cinemas(*),
      booking:bookings(*),
      items:snack_order_items(
        *,
        snack:snacks(*)
      )
    `)
    .single();

  if (error) throw error;
  return data;
};

export const deleteSnackOrder = async (id: string): Promise<void> => {
  const { error } = await supabase.from('snack_orders').delete().eq('id', id);
  if (error) throw error;
};
