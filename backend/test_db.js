import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
async function run() {
  const { data } = await supabase.from('policies').select('*').order('created_at', {ascending: false}).limit(5);
  console.log("DB POLICIES:", JSON.stringify(data, null, 2));
}
run();
