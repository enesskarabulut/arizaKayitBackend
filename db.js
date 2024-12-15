const express = require('express');
const cors = require('cors'); // CORS paketi
const { createClient } = require('@supabase/supabase-js');

// Express uygulamasını başlat
const app = express();

// CORS Middleware'i ekle
app.use(cors({
  origin: ['http://localhost:3000', 'https://ariza-kayit-frontend.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));


app.use(express.json()); // JSON verileri parse eder

// Supabase bağlantı bilgilerini yükle
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY; // Opsiyonel: Service Role Key

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase bağlantı bilgileri eksik! .env dosyasını kontrol edin.');
  process.exit(1); // Hata durumunda uygulamayı durdur
}

// Anon Key ile bağlantı oluştur
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Opsiyonel: Service Key ile ayrı bir admin bağlantısı oluştur
let supabaseAdmin = null;
if (supabaseServiceKey) {
  supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
  console.log('Admin bağlantısı oluşturuldu.');
} else {
  console.warn('Supabase Service Key tanımlı değil. Admin bağlantısı devre dışı.');
}

// Test endpoint (isteğe bağlı kontrol için)
app.get('/', (req, res) => {
  res.json({ message: 'CORS ve Supabase bağlantısı çalışıyor!' });
});

// Uygulama ve Supabase bağlantısını dışa aktar
module.exports = { app, supabase, supabaseAdmin };
