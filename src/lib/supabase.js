import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://cvjeoxneffctybjspjcs.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2amVveG5lZmZjdHlianNwamNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyNDk0MTIsImV4cCI6MjA3MDgyNTQxMn0.cIcP88hAcjbs-9Q5NRjuK_aInUeikPjwQl3s3Ukj528'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

