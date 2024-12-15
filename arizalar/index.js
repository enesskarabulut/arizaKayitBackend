const { supabase } = require('../../../supabase');
const { authMiddleware } = require('../../../utils/authMiddleware');

export default async function handler(req, res) {
  const user = authMiddleware(req, res);
  if (!user) return;

  if (req.method === 'GET') {
    const { status } = req.query;
    let query = supabase.from('arizalar').select('*');
    if (status) {
      query = query.eq('status', status);
    }
    const { data, error } = await query;
    if (error) {
      return res.status(500).json({ message: error.message });
    }
    return res.json(data);
  }

  if (req.method === 'POST') {
    const { adres, usta, status, ücret, tarih, detay } = req.body;
    if (!adres || !usta) {
      return res.status(400).json({ message: 'Adres ve usta bilgisi zorunludur' });
    }

    if (status === 'ileri tarihli' && !tarih) {
      return res.status(400).json({ message: 'İleri tarihli arıza için tarih alanı zorunludur' });
    }

    const { data, error } = await supabase
      .from('arizalar')
      .insert([{ adres, usta, status: status || 'işleme alındı', ücret, tarih, detay, dokumanlar: [] }])
      .select()
      .single();

    if (error) {
      return res.status(500).json({ message: error.message });
    }
    return res.status(201).json(data);
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
}
