const express = require('express');
const { prisma } = require('../prismaClient');
const { generatePrompt } = require('../utils/promptGenerator');
const { generateRecommendations } = require('../utils/recommendations');
const router = express.Router();

function pickPersistedProjectData(projectData) {
  const uiPreferences = {
    framework: projectData.framework,
    uiLibrary: projectData.uiLibrary,
    runtime: projectData.runtime,
    deploymentPlatform: projectData.deploymentPlatform
  };

  const persisted = {
    projectType: projectData.projectType ?? undefined,
    useAI: typeof projectData.useAI === 'boolean' ? projectData.useAI : undefined,
    projectName: projectData.projectName ?? undefined,
    colorPalette: projectData.colorPalette ?? undefined,
    navbarPosition: projectData.navbarPosition ?? undefined,
    pageCount: typeof projectData.pageCount === 'number' ? projectData.pageCount : undefined,
    dbProvider: projectData.dbProvider ?? undefined,
    ormChoice: projectData.ormChoice ?? undefined,
    authRequired: typeof projectData.authRequired === 'boolean' ? projectData.authRequired : undefined,
    apiType: projectData.apiType ?? undefined,
    additionalFeatures: Array.isArray(projectData.additionalFeatures)
      ? JSON.stringify(projectData.additionalFeatures)
      : undefined,
    uiPreferences: JSON.stringify(uiPreferences)
  };

  return Object.fromEntries(
    Object.entries(persisted).filter(([, value]) => value !== undefined)
  );
}

// POST - Generate prompt and recommendations
router.post('/', async (req, res) => {
  try {
    const projectData = req.body;

    // Generate the AI prompt
    const generatedPrompt = generatePrompt(projectData);

    // Generate recommendations
    const recommendations = generateRecommendations(projectData);

    res.json({
      success: true,
      prompt: generatedPrompt,
      recommendations: recommendations
    });
  } catch (error) {
    console.error('POST /api/generate failed:', error);
    res.status(500).json({
      error: error?.message || 'Generation error',
      code: error?.code || null,
      meta: error?.meta || null
    });
  }
});

// POST - Generate and save to database
router.post('/save', async (req, res) => {
  try {
    const { projectId, ...projectData } = req.body;

    if (!projectId) {
      return res.status(400).json({ error: 'projectId is required' });
    }

    // Generate prompt and recommendations
    const generatedPrompt = generatePrompt(projectData);
    const recommendations = generateRecommendations(projectData);
    const persistedProjectData = pickPersistedProjectData(projectData);

    // Save to database
    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: {
        ...persistedProjectData,
        generatedPrompt,
        recommendations: JSON.stringify(recommendations)
      }
    });

    res.json({
      success: true,
      project: updatedProject,
      recommendations
    });
  } catch (error) {
    console.error('POST /api/generate/save failed:', error);
    res.status(500).json({
      error: error?.message || 'Database save error',
      code: error?.code || null,
      meta: error?.meta || null
    });
  }
});

// GET - Retrieve generated prompt for a project
router.get('/:projectId', async (req, res) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: req.params.projectId }
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({
      success: true,
      prompt: project.generatedPrompt,
      recommendations: project.recommendations ? JSON.parse(project.recommendations) : []
    });
  } catch (error) {
    console.error('GET /api/generate/:projectId failed:', error);
    res.status(500).json({
      error: error?.message || 'Fetch error',
      code: error?.code || null,
      meta: error?.meta || null
    });
  }
});

module.exports = router;
