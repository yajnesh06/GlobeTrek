// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://phvtqnwwqbsboghcwtyj.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBodnRxbnd3cWJzYm9naGN3dHlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyNDI2MDcsImV4cCI6MjA1NjgxODYwN30.QI44unnSFidQsuGO7X1L_A5cPn1Ao2Hz3olk79s9440";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);