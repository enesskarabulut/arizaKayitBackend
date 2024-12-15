const { getUserByUsername } = require('../models/authModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

module.exports = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ message: 'Kullanıcı adı ve şifre gereklidir' });

  const user = await getUserByUsername(username);
  if (!user) return res.status(401).json({ message: 'Geçersiz kimlik bilgileri' });

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) return res.status(401).json({ message: 'Geçersiz şifre' });

  const token = jwt.sign({ id: user.id, username }, process.env.JWT_SECRET, { expiresIn: '1h' });
  return res.json({ token });
};
