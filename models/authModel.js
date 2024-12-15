const supabase = require('../supabase'); // Supabase bağlantısını dahil et

async function getUserByUsername(username) {
  const { data, error } = await supabase
    .from('users') // 'users' tablosundan veri çek
    .select('*')
    .eq('username', username)
    .single();
  
  if (error) return null;
  return data;
}

module.exports = {
  getUserByUsername
};
