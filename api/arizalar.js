const { getArizalar, getAriza, createNewAriza, updateAriza, deleteAriza } = require('../models/arizaModel');
const { uploadToSupabase } = require('./upload');
const authMiddleware = require('./auth');

module.exports = async (req, res) => {
  const method = req.method;
  const id = req.query.id; // Arıza ID'si query'den alınır.

  // Yetkilendirme middleware
  await authMiddleware(req, res);

  if (method === 'GET') {
    // Tüm arızaları getir
    if (!id) return res.json(await getArizalar());
    // Tek bir arıza getir
    const ariza = await getAriza(id);
    return ariza ? res.json(ariza) : res.status(404).json({ message: 'Arıza bulunamadı' });
  }

  if (method === 'POST') {
    const { adres, usta, status, tarih, detay } = req.body;

    if (!adres || !usta) return res.status(400).json({ message: 'Adres ve usta bilgisi zorunludur' });
    if (status === 'ileri tarihli' && !tarih)
      return res.status(400).json({ message: 'İleri tarihli arıza için tarih alanı zorunludur' });

    const yeniAriza = await createNewAriza(req.body);
    return res.status(201).json(yeniAriza);
  }

  if (method === 'PUT') {
    const updatedAriza = await updateAriza(id, req.body);
    return updatedAriza
      ? res.json(updatedAriza)
      : res.status(404).json({ message: 'Güncellenecek arıza bulunamadı' });
  }

  if (method === 'DELETE') {
    const deleted = await deleteAriza(id);
    return deleted ? res.json({ message: 'Arıza silindi' }) : res.status(404).json({ message: 'Silinecek arıza bulunamadı' });
  }

  return res.status(405).json({ message: 'Geçersiz istek yöntemi' });
};
