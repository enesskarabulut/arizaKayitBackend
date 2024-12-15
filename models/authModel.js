const users = [
    { username: 'admin', password_hash: '$2b$10$hashlanmisSifre' },
  ];
  
  exports.getUserByUsername = async (username) => users.find((user) => user.username === username);
  