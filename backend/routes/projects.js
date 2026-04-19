const express = require('express');
const { prisma } = require('../prismaClient');
const router = express.Router();

// GET all projects
router.get('/', async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(projects);
  } catch (error) {
    console.error('GET /api/projects failed:', error);
    res.status(500).json({
      error: error?.message || 'Database error',
      code: error?.code || null,
      meta: error?.meta || null
    });
  }
});

// GET single project
router.get('/:id', async (req, res) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: req.params.id }
    });
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json(project);
  } catch (error) {
    console.error('GET /api/projects/:id failed:', error);
    res.status(500).json({
      error: error?.message || 'Database error',
      code: error?.code || null,
      meta: error?.meta || null
    });
  }
});

// CREATE new project
router.post('/', async (req, res) => {
  try {
    const { title, projectType, useAI, projectName } = req.body;
    const project = await prisma.project.create({
      data: {
        title: title || 'New Project',
        projectType: projectType || 'web',
        useAI: useAI !== undefined ? useAI : true,
        projectName: projectName || null
      }
    });
    res.status(201).json(project);
  } catch (error) {
    console.error('POST /api/projects failed:', error);
    res.status(500).json({
      error: error?.message || 'Database error',
      code: error?.code || null,
      meta: error?.meta || null
    });
  }
});

// UPDATE project
router.put('/:id', async (req, res) => {
  try {
    const project = await prisma.project.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(project);
  } catch (error) {
    console.error('PUT /api/projects/:id failed:', error);
    res.status(500).json({
      error: error?.message || 'Database error',
      code: error?.code || null,
      meta: error?.meta || null
    });
  }
});

// DELETE project
router.delete('/:id', async (req, res) => {
  try {
    await prisma.project.delete({
      where: { id: req.params.id }
    });
    res.json({ message: 'Project deleted' });
  } catch (error) {
    console.error('DELETE /api/projects/:id failed:', error);
    res.status(500).json({
      error: error?.message || 'Database error',
      code: error?.code || null,
      meta: error?.meta || null
    });
  }
});

module.exports = router;
