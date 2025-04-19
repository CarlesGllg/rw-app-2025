
import { createClient } from '@supabase/supabase-js';
import { supabase as integrationClient } from '@/integrations/supabase/client';

// To avoid creating multiple clients, we export the one from integrations
export const supabase = integrationClient;

// Log a warning if using default values
if (import.meta.env.DEV) {
  console.log('Using Supabase client from integrations');
}
