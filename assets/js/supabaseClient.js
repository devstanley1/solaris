// assets/js/supabaseClient.js

// CONFIGURATION - Replace with your valid Supabase project URL and anonymous key
const SUPABASE_URL = 'YOUR_SUPABASE_PROJECT_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

// Initialize Supabase Client globally if window.supabase exists (from CDN)
if (window.supabase) {
    window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log("Supabase Client initialized successfully.");
} else {
    console.error("Supabase script wasn't loaded from CDN.");
}
