// supabaseClient.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://mquxomutiwqvihuvdsgd.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xdXhvbXV0aXdxdmlodXZkc2dkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTM1NDQyNzMsImV4cCI6MjAyOTEyMDI3M30.xAsJk8eLeLCjdlPRbMA_ngPYbjP2enEU2ehP_WHvO10";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
