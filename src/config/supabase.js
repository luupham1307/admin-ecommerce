import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://lnfdkaooikvjxeghvcba.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxuZmRrYW9vaWt2anhlZ2h2Y2JhIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODE5ODA1ODQsImV4cCI6MTk5NzU1NjU4NH0.0tAzb1kff9p0re4YMLs1CLrTQ8x9lJLhcLceUY6zZ7k"
);

export default supabase;
