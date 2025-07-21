const CastingCall = require('../models/CastingCall');
const Notification = require('../models/Notification');

// Create a new casting call
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
      isApproved: false, // Admin approval needed
    });

    await call.save();
    res.status(201).json({ message: "Casting call created", call });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create casting call" });
  }
};

// Fetch all approved casting calls, optionally filter by role/location
exports.getCastingCalls = async (req, res) => {
  const { role, location } = req.query;
  const filter = { isApproved: true };

  if (role) filter.role = role;
  if (location) filter.location = location;

  try {
    const calls = await CastingCall.find(filter).populate('creator', 'name role');
    res.json(calls);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch casting calls' });
  }
};
// Get applicants for a specific casting call
exports.getApplicants = async (req, res) => {
  const { callId } = req.params;

  try {
    const call = await CastingCall.findById(callId)
      .populate('applicants', 'name email role city skills language') // populate applicant data
      .populate('creator', 'name');

    if (!call) return res.status(404).json({ message: 'Casting call not found' });

    // Only allow the creator to view
    if (call.creator._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    res.status(200).json({ applicants: call.applicants });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to load applicants' });
  }
};


// Apply to a casting call
exports.applyToCasting = async (req, res) => {
  const { callId } = req.params;
  const applicantId = req.user.id;

  try {
    const call = await CastingCall.findById(callId);
    if (!call) return res.status(404).json({ message: "Casting call not found" });

    // Add applicant to list if not already applied
    if (!call.applicants) call.applicants = [];
    if (call.applicants.includes(applicantId)) {
      return res.status(400).json({ message: "Already applied to this casting call" });
    }

    call.applicants.push(applicantId);
    await call.save();

    // Optional: Notify the creator
    const Notification = require('../models/Notification');
    const notify = new Notification({
      user: call.creator,
      message: "Someone applied to your casting call",
      link: `/casting/${call._id}`
    });
    await notify.save();

    res.status(200).json({ message: "Applied successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Application failed" });
  }
};
