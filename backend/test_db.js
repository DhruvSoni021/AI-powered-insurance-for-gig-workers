import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
async function run() {
  const { data } = await supabase.from('policies').select('*').eq('status', 'active');
  console.log('Active count:', data?.length);
  if(data?.length) {
    const { data: up, error } = await supabase.from('policies')
      .update({ status: 'canceled', end_date: new Date().toISOString() })
      .eq('id', data[0].id)
      .select();
    console.log('Update:', up, error);
  }
}
run();
