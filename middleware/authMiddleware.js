const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // Get the Authorization header
  const authHeader = req.header('Authorization');

  // Validate the header format
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: "No token provided" });
  }

  // Extract the token from the header
  const token = authHeader.split(' ')[1];

  try {
    // Verify the token using your secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the decoded user data to req.user
    req.user = decoded;

    // Continue to the next middleware/route handler
    next();
  } catch (err) {
    console.error("JWT verification error:", err.message);
    return res.status(401).json({ message: "Invalid token" });
  }
};
