const express = require('express');
const router = express.Router();
const { getMonthlyLeaderboard } = require('../controllers/leaderboardController');

router.get('/monthly', getMonthlyLeaderboard);

module.exports = router;
