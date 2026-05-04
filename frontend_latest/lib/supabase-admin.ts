import { createClient } from "@supabase/supabase-js"

// Note: This client should only be used in server-side contexts where the
// SUPABASE_SERVICE_ROLE_KEY is available and secure.
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
)
