import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://bhtrdlinehvnftnixdvm.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJodHJkbGluZWh2bmZ0bml4ZHZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI0MTY5MTAsImV4cCI6MjEwNzk5MjkxMH0.tdZPssL8o30R5JDovmA4diN1aJV72fza7J_pceIFPKQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
