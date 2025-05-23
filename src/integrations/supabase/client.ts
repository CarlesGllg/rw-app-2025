
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://pwhibcdunfpccyuewpob.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3aGliY2R1bmZwY2N5dWV3cG9iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUwODAzMTgsImV4cCI6MjA2MDY1NjMxOH0.DWq7Hsue9J8Ns4wZvQM5JQ_s-47muIcZbqffKRUirfw";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(
  SUPABASE_URL, 
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      flowType: 'pkce',
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  }
);
