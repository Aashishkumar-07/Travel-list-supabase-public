import { createClient } from "@supabase/supabase-js";
export const supabase = createClient(
  "https://qvkynqlomqztfumvybrz.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2a3lucWxvbXF6dGZ1bXZ5YnJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTgyMzk5MjQsImV4cCI6MjAxMzgxNTkyNH0.nect7WszYYsuKA0e5jQqOf_61rSc2rlzt3Qs9ZOPVyM"
);
