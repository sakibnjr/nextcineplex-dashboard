export type UserRole = 'user' | 'admin';

export interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  user_role: UserRole;
  created_at: string;
  updated_at: string;
}
