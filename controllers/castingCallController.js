const CastingCall = require('../models/CastingCall');

// Create casting call (initially unapproved)
exports.createCastingCall = async (req, res) => {
  try {
    const { title, description, role, location, requiredSkills, language, deadline } = req.body;

    const call = new CastingCall({
      creator: req.user.id,
      title,
      description,
      role,
      location,
      requiredSkills,
      language,
      deadline,
      isApproved: false, // Admin will approve later
    });

    await call.save();
    res.status(201).json({ message: "Casting call created", call });
  } catch (err) {
    res.status(500).json({ message: "Failed to create casting call" });
  }
};

// Get approved casting calls (filtered)
exports.getCastingCalls = async (req, res) => {
  const { role, location } = req.query;
  const filter = { isApproved: true };

  if (role) filter.role = role;
  if (location) filter.location = location;

  try {
    const calls = await CastingCall.find(filter).populate('creator', 'name role');
    res.json(calls);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch casting calls' });
  }
};
