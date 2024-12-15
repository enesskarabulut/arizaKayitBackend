const { createClient } = require('@supabase/supabase-js');

// Supabase bağlantı bilgilerini .env dosyasından çekiyoruz
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL veya ANON_KEY eksik! Lütfen .env dosyasını kontrol edin.');
}

// Supabase istemcisi oluşturuluyor
const supabase = createClient(supabaseUrl, supabaseAnonKey);

module.exports = supabase;
