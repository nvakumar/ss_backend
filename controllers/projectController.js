const Project = require('../models/Project');

// Create a project post
exports.createProject = async (req, res) => {
  const { title, description, contact } = req.body;
  const userId = req.user.id;

  try {
    const project = new Project({
      title,
      description,
      contact,
      createdBy: userId
    });

    await project.save();
    res.status(201).json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create project' });
  }
};

// Get all projects (feed)
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find().populate('createdBy', 'name role');
    res.json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch projects' });
  }
};

// Edit own project
exports.updateProject = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const { title, description, contact } = req.body;

  try {
    const project = await Project.findById(id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (project.createdBy.toString() !== userId)
      return res.status(403).json({ message: 'Not authorized to update this project' });

    project.title = title;
    project.description = description;
    project.contact = contact;

    await project.save();
    res.json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update project' });
  }
};

// Delete own project
exports.deleteProject = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const project = await Project.findById(id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (project.createdBy.toString() !== userId)
      return res.status(403).json({ message: 'Not authorized to delete this project' });

    await project.deleteOne();
    res.json({ message: 'Project deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete project' });
  }
};
