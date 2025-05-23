import { createBrowserClient } from '@supabase/ssr';
import { Database } from './database.types';

// TEMPORARY DEBUGGING:
console.log('VITE_SUPABASE_URL from import.meta.env:', import.meta.env.VITE_SUPABASE_URL);
console.log('VITE_SUPABASE_ANON_KEY from import.meta.env:', import.meta.env.VITE_SUPABASE_ANON_KEY);

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // TEMPORARY DEBUGGING:
  console.error('Supabase env vars MISSING or FALSY. URL:', supabaseUrl, 'Key:', supabaseAnonKey);
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);