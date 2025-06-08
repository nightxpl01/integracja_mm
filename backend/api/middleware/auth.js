const jwt = require('jsonwebtoken');
require('dotenv').config();

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];
  if (!token) {
    console.log('No token provided');
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
  if (err) return res.sendStatus(403);
  console.log('JWT verified, user:', user);  // <- tu powinno być id
  req.user = user;
  next();
});
}

module.exports = authenticateToken;
