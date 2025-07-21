const Upload = require('../models/Upload');
const Like = require('../models/Like');
const Comment = require('../models/Comment');
const User = require('../models/User');

exports.getMonthlyLeaderboard = async (req, res) => {
  try {
    const start = new Date();
    start.setDate(1); start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setMonth(end.getMonth() + 1);

    // Fetch public uploads this month
    const uploads = await Upload.find({
      createdAt: { $gte: start, $lt: end },
      isPrivate: false,
    }).populate('user');

    const leaderboardMap = {};

    for (const upload of uploads) {
      const userId = upload.user._id.toString();
      const role = upload.user.role;

      // Count likes and comments
      const likesCount = await Like.countDocuments({ upload: upload._id });
      const commentsCount = await Comment.countDocuments({ upload: upload._id });

      const score = (likesCount * 2) + (commentsCount * 1); // You can modify weights

      if (!leaderboardMap[role]) leaderboardMap[role] = {};

      if (!leaderboardMap[role][userId]) {
        leaderboardMap[role][userId] = {
          userId,
          name: upload.user.name,
          role,
          totalLikes: 0,
          totalComments: 0,
          score: 0,
        };
      }

      leaderboardMap[role][userId].totalLikes += likesCount;
      leaderboardMap[role][userId].totalComments += commentsCount;
      leaderboardMap[role][userId].score += score;
    }

    // Convert to sorted arrays
    const topByRole = {};
    for (const role in leaderboardMap) {
      const sorted = Object.values(leaderboardMap[role])
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);
      topByRole[role] = sorted;
    }

    res.json(topByRole);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch leaderboard' });
  }
};
