const Notification = require('../models/Notification');

const createNotification = async (userId, message, link) => {
  try {
    const notify = new Notification({ user: userId, message, link });
    await notify.save();
  } catch (err) {
    console.error("Notification error:", err);
  }
};

module.exports = createNotification;
