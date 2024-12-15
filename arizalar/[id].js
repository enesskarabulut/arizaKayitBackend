const { supabase } = require('../../../supabase');
const { authMiddleware } = require('../../../utils/authMiddleware');

export default async function handler(req, res) {
  const user = authMiddleware(req, res);
  if (!user) return;

  const { id } = req.query;

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('arizalar')
      .select('*')
      .eq('id', id)
      .single();
    if (error) return res.status(404).json({ message: 'Arıza bulunamadı' });
    return res.json(data);
  }

  if (req.method === 'PUT') {
    const { adres, usta, status, ücret, tarih, detay } = req.body;
    if (status === 'ileri tarihli' && !tarih) {
      return res.status(400).json({ message: 'İleri tarihli arıza için tarih alanı zorunludur' });
    }

    const fields = {};
    if (adres !== undefined) fields.adres = adres;
    if (usta !== undefined) fields.usta = usta;
    if (status !== undefined) fields.status = status;
    if (ücret !== undefined) fields.ücret = ücret;
    if (tarih !== undefined) fields.tarih = tarih;
    if (detay !== undefined) fields.detay = detay;

    const { data, error } = await supabase
      .from('arizalar')
      .update(fields)
      .eq('id', id)
      .select()
      .single();

    if (error || !data) return res.status(404).json({ message: 'Güncellenecek arıza bulunamadı' });
    return res.json(data);
  }

  if (req.method === 'DELETE') {
    const { data, error } = await supabase
      .from('arizalar')
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error || !data) return res.status(404).json({ message: 'Silinecek arıza bulunamadı' });
    return res.json({ message: 'Arıza kaydı silindi' });
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
}
