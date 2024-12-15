import formidable from 'formidable';
import fs from 'fs';
import { supabaseAdmin } from '../../../../supabase';
import { authMiddleware } from '../../../../utils/authMiddleware';

export const config = {
  api: {
    bodyParser: false
  }
};

export default async function handler(req, res) {
  const user = authMiddleware(req, res);
  if (!user) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { id } = req.query;

  const { data: ariza, error: arizaError } = await supabaseAdmin
    .from('arizalar')
    .select('*')
    .eq('id', id)
    .single();

  if (arizaError || !ariza) {
    return res.status(404).json({ message: 'Arıza bulunamadı' });
  }

  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({ message: 'Form parse hatası' });
    }

    const file = files.file;
    if (!file) {
      return res.status(400).json({ message: 'Dosya yüklenmedi' });
    }

    const fileData = fs.readFileSync(file.filepath);
    const filename = Date.now() + '-' + file.originalFilename;

    const { data: uploadData, error: uploadError } = await supabaseAdmin
      .storage
      .from('dokumanlar')
      .upload(filename, fileData, {
        contentType: file.mimetype,
        upsert: false
      });

    if (uploadError) {
      return res.status(500).json({ message: 'Dosya yüklenemedi', error: uploadError.message });
    }

    const { data: publicUrlData } = supabaseAdmin
      .storage
      .from('dokumanlar')
      .getPublicUrl(filename);

    const dokumanlar = ariza.dokumanlar || [];
    dokumanlar.push(publicUrlData.publicUrl);

    const { data: updated, error: updateError } = await supabaseAdmin
      .from('arizalar')
      .update({ dokumanlar })
      .eq('id', id)
      .select()
      .single();

    if (updateError || !updated) {
      return res.status(500).json({ message: 'Dosya eklendi ama arıza güncellenemedi' });
    }

    return res.json({ message: 'Dosya başarıyla yüklendi', ariza: updated });
  });
}
