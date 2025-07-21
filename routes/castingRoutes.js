const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
  createCastingCall,
  getCastingCalls,
  getApplicants,
  applyToCasting
} = require('../controllers/castingController');

router.post('/', auth, createCastingCall);
router.get('/', getCastingCalls);
router.post('/:callId/apply', auth, applyToCasting);
router.get('/:callId/applicants', auth, getApplicants);

module.exports = router;
