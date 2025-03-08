
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/integrations/supabase/types';

// Get the Supabase URL and anon key from environment variables
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://phvtqnwwqbsboghcwtyj.supabase.co";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBodnRxbnd3cWJzYm9naGN3dHlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyNDI2MDcsImV4cCI6MjA1NjgxODYwN30.QI44unnSFidQsuGO7X1L_A5cPn1Ao2Hz3olk79s9440";

// Log whether we're using environment variables or fallbacks
if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn('Using fallback Supabase credentials. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables for production.');
}

// Initialize the Supabase client
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
