const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.header('Authorization');

  console.log('Auth Middleware: Received Authorization header:', authHeader); // Log the full header

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('Auth Middleware: No token provided or invalid format.');
    return res.status(401).json({ message: 'No token provided or invalid format' });
  }

  const token = authHeader.split(' ')[1]; // Extract token after 'Bearer'
  console.log('Auth Middleware: Extracted token (first 10 chars):', token.substring(0, 10) + '...'); // Log part of the token

  // For debugging: Log the secret being used (do NOT log the full secret in production!)
  // console.log('Auth Middleware: JWT_SECRET length:', process.env.JWT_SECRET ? process.env.JWT_SECRET.length : 'undefined');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Auth Middleware: Token decoded successfully:', decoded); // Log the decoded payload

    // Your current setup: req.user = decoded. If your JWT payload is { id: '...', iat: ..., exp: ... }
    // then req.user.id will correctly access decoded.id.
    // If your JWT payload is { user: { id: '...' }, iat: ..., exp: ... },
    // then you might need req.user = decoded.user; and then access req.user.id.
    // Check your login route's token signing part to confirm the payload structure.
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Auth Middleware: JWT verification failed:', err.message); // Log the specific error message from JWT
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
