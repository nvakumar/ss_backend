const Message = require('../models/Message');
const Group = require('../models/Group');

exports.sendMessage = async (req, res) => {
  const { text } = req.body;
  const { groupId } = req.params;
  const userId = req.user.id;

  try {
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    if (!group.members.includes(userId)) {
      return res.status(403).json({ message: "You are not a member of this group" });
    }

    const message = new Message({
      text,
      sender: userId,
      group: groupId
    });

    await message.save();

    res.status(201).json({ message: "Message sent", data: message });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error sending message" });
  }
};

exports.getMessages = async (req, res) => {
  const { groupId } = req.params;
  try {
    const messages = await Message.find({ group: groupId })
      .populate('sender', 'name role')
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching messages" });
  }
};
