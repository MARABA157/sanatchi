import { createClient } from '@supabase/supabase-js';
import { env } from '@/config/env';

const supabaseUrl = env.SUPABASE_URL;
const supabaseAnonKey = env.SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error('Missing SUPABASE_URL');
}

if (!supabaseAnonKey) {
  throw new Error('Missing SUPABASE_ANON_KEY');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
  },
});

export type Tables = Database['public']['Tables'];
export type Profile = Tables['profiles']['Row'];
export type Image = Tables['images']['Row'];