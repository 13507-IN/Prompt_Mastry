const express = require('express');
const { prisma } = require('../prismaClient');
const { generatePrompt } = require('../utils/promptGenerator');
const { generateRecommendations } = require('../utils/recommendations');
const { validateGeneratePayload } = require('../contract/projectContract');
const { safeJsonStringify, safeJsonParse } = require('../utils/safeJson');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const { serializeProjectRecord } = require('../utils/projectSerializer');
const { createMemoryRateLimiter } = require('../middleware/rateLimit');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();
router.use(authMiddleware);

const generationLimiter = createMemoryRateLimiter({
  windowMs: 60 * 1000,
  limit: 30,
  keyPrefix: 'generate',
});

router.use(generationLimiter);

function normalizeToBoolean(value) {
  if (typeof value === 'boolean') return value;
  if (value === 'true') return true;
  if (value === 'false') return false;
  return undefined;
}

function normalizeToNumber(value) {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const parsed = Number.parseInt(value, 10);
    if (Number.isFinite(parsed)) return parsed;
  }
  return undefined;
}

function deduplicateArray(arr) {
  if (!Array.isArray(arr)) return [];
  return [...new Set(arr)];
}

function pickPersistedProjectData(projectData) {
  const additionalFeatures = deduplicateArray(projectData.additionalFeatures);
  const normalizedPageCount = normalizeToNumber(projectData.pageCount);
  const normalizedAuthRequired = normalizeToBoolean(projectData.authRequired);
  const normalizedUseAI = normalizeToBoolean(projectData.useAI);

  const uiPreferences = {
    framework: projectData.framework || null,
    uiLibrary: projectData.uiLibrary || null,
    runtime: projectData.runtime || null,
    deploymentPlatform: projectData.deploymentPlatform || null,
    generationMode: projectData.generationMode || 'balanced',
  };

  const persisted = {
    projectType: projectData.projectType ?? undefined,
    useAI: normalizedUseAI !== undefined ? normalizedUseAI : undefined,
    projectName: projectData.projectName ?? undefined,
    colorPalette: projectData.colorPalette ?? undefined,
    navbarPosition: projectData.navbarPosition ?? undefined,
    pageCount: normalizedPageCount !== undefined ? normalizedPageCount : undefined,
    dbProvider: projectData.dbProvider ?? undefined,
    ormChoice: projectData.ormChoice ?? undefined,
    authRequired: normalizedAuthRequired !== undefined ? normalizedAuthRequired : undefined,
    apiType: projectData.apiType ?? undefined,
    additionalFeatures: safeJsonStringify(additionalFeatures, '[]'),
    uiPreferences: safeJsonStringify(uiPreferences, '{}'),
  };

  return Object.fromEntries(
    Object.entries(persisted).filter(([, value]) => value !== undefined)
  );
}

router.post('/', async (req, res) => {
  const validation = validateGeneratePayload(req.body || {});
  if (!validation.isValid) {
    return sendError(res, {
      status: 400,
      code: 'VALIDATION_ERROR',
      message: 'Invalid generation payload',
      details: validation.errors,
    });
  }

  try {
    const generatedPrompt = generatePrompt(validation.data);
    const recommendations = generateRecommendations(validation.data);

    return sendSuccess(res, {
      status: 'generated',
      prompt: generatedPrompt,
      recommendations,
      generationMode: validation.data.generationMode,
    });
  } catch (error) {
    console.error('POST /api/generate failed:', error);
    return sendError(res, {
      status: 500,
      code: 'PROMPT_GENERATION_FAILED',
      message: 'Failed to generate prompt',
      details: { reason: error?.message || 'Unknown generation error' },
    });
  }
});

router.post('/save', async (req, res) => {
  const validation = validateGeneratePayload(req.body || {}, { requireProjectId: true });
  if (!validation.isValid) {
    return sendError(res, {
      status: 400,
      code: 'VALIDATION_ERROR',
      message: 'Invalid generation payload',
      details: validation.errors,
    });
  }

  const { projectId, ...projectData } = validation.data;

  try {
    const existingProject = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!existingProject) {
      return sendError(res, {
        status: 404,
        code: 'PROJECT_NOT_FOUND',
        message: 'Project not found',
      });
    }

    if (existingProject.tenantId !== req.user.tenantId || existingProject.userId !== req.user.userId) {
      return sendError(res, {
        status: 403,
        code: 'FORBIDDEN',
        message: 'You do not have permission to modify this project',
      });
    }

    const generatedPrompt = generatePrompt(projectData);
    const recommendations = generateRecommendations(projectData);
    const persistedProjectData = pickPersistedProjectData(projectData);

    try {
      const updatedProject = await prisma.project.update({
        where: { id: projectId },
        data: {
          ...persistedProjectData,
          generatedPrompt,
          recommendations: safeJsonStringify(recommendations, '[]'),
        },
      });

      return sendSuccess(res, {
        status: 'saved',
        project: serializeProjectRecord(updatedProject),
        prompt: generatedPrompt,
        recommendations,
        generationMode: projectData.generationMode,
      });
    } catch (dbError) {
      if (dbError?.code === 'P2025') {
        return sendError(res, {
          status: 404,
          code: 'PROJECT_NOT_FOUND',
          message: 'Project not found',
        });
      }

      return sendSuccess(res, {
        status: 'preview_only',
        statusReason: 'database_unavailable',
        prompt: generatedPrompt,
        recommendations,
        generationMode: projectData.generationMode,
      });
    }
  } catch (error) {
    console.error('POST /api/generate/save failed:', error);
    return sendError(res, {
      status: 500,
      code: 'PROMPT_SAVE_FAILED',
      message: 'Failed to generate and save prompt',
      details: { reason: error?.message || 'Unknown error' },
    });
  }
});

router.get('/:projectId', async (req, res) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: req.params.projectId },
    });

    if (!project) {
      return sendError(res, {
        status: 404,
        code: 'PROJECT_NOT_FOUND',
        message: 'Project not found',
      });
    }

    if (project.tenantId !== req.user.tenantId || project.userId !== req.user.userId) {
      return sendError(res, {
        status: 403,
        code: 'FORBIDDEN',
        message: 'You do not have permission to access this project',
      });
    }

    const recommendations = safeJsonParse(project.recommendations, []);

    return sendSuccess(res, {
      status: 'saved',
      prompt: project.generatedPrompt || '',
      recommendations,
    });
  } catch (error) {
    console.error('GET /api/generate/:projectId failed:', error);
    return sendError(res, {
      status: 500,
      code: 'PROMPT_FETCH_FAILED',
      message: 'Failed to fetch generated prompt',
      details: { reason: error?.message || 'Unknown fetch error' },
    });
  }
});

module.exports = router;
