const { verifyJWT } = require('./verifyJWT');

function authMiddleware(req, res) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Yetkisiz erişim' });
    return null;
  }

  const token = authHeader.split(' ')[1];
  const user = verifyJWT(token);
  if (!user) {
    res.status(401).json({ message: 'Geçersiz token' });
    return null;
  }

  return user;
}

module.exports = { authMiddleware };
