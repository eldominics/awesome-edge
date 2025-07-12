import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://uzfxbgifnryqcwhripfy.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV6ZnhiZ2lmbnJ5cWN3aHJpcGZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4NDQ3MDMsImV4cCI6MjA2NjQyMDcwM30.7MdO1MRI6BNIh_-Lrr85th9LLv_MJk1Q0R5rNZJFUl0";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
