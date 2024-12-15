const { createClient } = require('@supabase/supabase-js');

// Supabase bağlantı bilgilerini yükle
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase bağlantı bilgileri eksik! .env dosyasını kontrol edin.');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

module.exports = { supabase };
