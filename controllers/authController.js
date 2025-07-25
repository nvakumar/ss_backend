const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// It's good practice to define JWT_SECRET directly from process.env
// within the function or at the top level if it's used across multiple functions.
const JWT_SECRET = process.env.JWT_SECRET; // This line is fine.

// REGISTER
exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role
    });

    await user.save();

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Registration failed" });
  }
};

// LOGIN
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login failed" });
  }
};

// UPDATE PROFILE
exports.updateProfile = async (req, res) => {
  const userId = req.user.id;
  const { name, role, city, skills, language } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, role, city, skills, language },
      { new: true }
    );

    res.json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        city: updatedUser.city,
        skills: updatedUser.skills,
        language: updatedUser.language,
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating profile" });
  }
};

// --- ADDED: GET CURRENT USER PROFILE ---
exports.getMe = async (req, res) => {
  try {
    // req.user is populated by authMiddleware based on the JWT payload.
    // We use req.user.id to find the user in the database.
    // Select only the necessary fields, excluding the password.
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user); // Return the user's profile
  } catch (err) {
    console.error('Error fetching user profile (getMe):', err.message); // Added context to log
    res.status(500).send('Server Error');
  }
};
