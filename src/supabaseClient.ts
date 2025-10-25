import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://oaggahfvybmxmiyamnlo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9hZ2dhaGZ2eWJteG1peWFtbmxvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3MDc2MzUsImV4cCI6MjA2ODI4MzYzNX0.MX_BB86JJd2fo3-1bkuPc52DVxuwYF5G9t1BltHTFkE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
