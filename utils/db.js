const { createClient } = require('@supabase/supabase-js');

// Supabase bağlantısını kur
const supabaseUrl = process.env.SUPABASE_URL; // .env'den URL
const supabaseKey = process.env.SUPABASE_KEY; // .env'den API KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase bağlantı bilgileri eksik. .env dosyasını kontrol edin.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Supabase istemcisini dışa aktar
module.exports = supabase;
