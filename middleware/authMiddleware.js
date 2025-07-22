const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.header('Authorization');

  if (!authHeader)
    return res.status(401).json({ message: "No token provided" });

  const token = authHeader.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : authHeader;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Now contains `id`
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
