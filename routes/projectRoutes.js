const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
  createProject,
  getProjects,
  updateProject,
  deleteProject
} = require('../controllers/projectController');

router.post('/', auth, createProject);
router.get('/', getProjects);
router.put('/:id', auth, updateProject);
router.delete('/:id', auth, deleteProject);

module.exports = router;
