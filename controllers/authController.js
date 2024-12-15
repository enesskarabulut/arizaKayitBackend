const { getUserByUsername } = require('../models/authModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.loginUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Kullanıcı adı ve şifre gereklidir' });
  }

  // Veritabanından kullanıcıyı çek
  const user = await getUserByUsername(username);
  if (!user) {
    return res.status(401).json({ message: 'Geçersiz kimlik bilgileri' });
  }

  // Şifre doğrulama
  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) {
    return res.status(401).json({ message: 'Geçersiz kimlik bilgileri' });
  }

  // JWT token oluşturma
  const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });

  res.json({ token });
};
