
import { createClient } from '@supabase/supabase-js';

// Supabase URL and anon key from the integrations file
const supabaseUrl = "https://pwhibcdunfpccyuewpob.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3aGliY2R1bmZwY2N5dWV3cG9iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUwODAzMTgsImV4cCI6MjA2MDY1NjMxOH0.DWq7Hsue9J8Ns4wZvQM5JQ_s-47muIcZbqffKRUirfw";

// Create the Supabase client with proper auth configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    flowType: 'pkce',
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Log a warning if using default values
if (import.meta.env.DEV) {
  console.log('Using Supabase URL:', supabaseUrl);
}
