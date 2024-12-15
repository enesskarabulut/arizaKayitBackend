const { supabase } = require('../db'); // Supabase bağlantısını dahil et

module.exports = async (req, res) => {
  const method = req.method;

  // GET: Tüm arıza kayıtlarını getir
  if (method === 'GET') {
    const { data, error } = await supabase
      .from('arizalar') // 'arizalar' tablosundan veri çek
      .select('*');

    if (error) {
      console.error("Supabase Hatası:", error.message);
      return res.status(500).json({ message: 'Arızalar yüklenemedi', error: error.message });
    }

    return res.json(data);
  }

  // POST: Yeni arıza kaydı ekle
  if (method === 'POST') {
    const { adres, usta, status, tarih, ücret, detay } = req.body;

    if (!adres || !usta) {
      return res.status(400).json({ message: 'Adres ve usta bilgisi zorunludur' });
    }

    const { data, error } = await supabase
      .from('arizalar')
      .insert([{ adres, usta, status, tarih, ücret, detay }]);

    if (error) {
      console.error("Supabase Hatası:", error.message);
      return res.status(500).json({ message: 'Arıza kaydı eklenemedi', error: error.message });
    }

    return res.status(201).json(data);
  }

  return res.status(405).json({ message: 'Geçersiz istek yöntemi' });
};
