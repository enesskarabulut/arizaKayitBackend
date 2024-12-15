const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

module.exports.uploadToSupabase = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'Dosya yüklenmedi' });

  const file = req.file;
  const { data, error } = await supabase.storage
    .from('uploads')
    .upload(`ariza/${Date.now()}-${file.originalname}`, file.buffer);

  if (error) return res.status(500).json({ error: error.message });
  return data;
};
