// src/middleware/auth.js
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.ACCESS_TOKEN_SECRET;

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    return res.sendStatus(403); // Forbidden if no token
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.sendStatus(403); // Forbidden if token is invalid
    }
    req.user = decoded;
    next();
  });
};

module.exports = verifyToken;
