const Group = require('../models/Group');

exports.createGroup = async (req, res) => {
  const { name, description } = req.body;
  try {
    const existing = await Group.findOne({ name });
    if (existing) return res.status(400).json({ message: "Group name already exists" });

    const group = new Group({ name, description, members: [req.user.id] });
    await group.save();

    res.status(201).json({ message: "Group created", group });
  } catch (err) {
    res.status(500).json({ message: "Error creating group" });
  }
};

exports.joinGroup = async (req, res) => {
  const groupId = req.params.groupId;
  try {
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    if (group.members.includes(req.user.id)) {
      return res.status(400).json({ message: "Already a member" });
    }

    group.members.push(req.user.id);
    await group.save();

    res.json({ message: "Joined group", group });
  } catch (err) {
    res.status(500).json({ message: "Error joining group" });
  }
};

exports.getAllGroups = async (req, res) => {
  try {
    const groups = await Group.find().populate('members', 'name role');
    res.json(groups);
  } catch (err) {
    res.status(500).json({ message: "Error fetching groups" });
  }
};
