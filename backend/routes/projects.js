const express = require('express');
const { prisma } = require('../prismaClient');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const { validateCreateProjectPayload } = require('../contract/projectContract');
const { serializeProjectRecord, serializeProjectRecords } = require('../utils/projectSerializer');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();
router.use(authMiddleware);

function parsePagination(query) {
  const pageRaw = Number.parseInt(query.page, 10);
  const limitRaw = Number.parseInt(query.limit, 10);

  const page = Number.isFinite(pageRaw) && pageRaw > 0 ? pageRaw : 1;
  const limit = Number.isFinite(limitRaw) && limitRaw > 0 ? Math.min(limitRaw, 100) : 10;
  const skip = (page - 1) * limit;

  return { page, limit, skip };
}

router.get('/', async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query);
  const where = {
    tenantId: req.user.tenantId,
    userId: req.user.userId,
  };

  try {
    const [total, projects] = await Promise.all([
      prisma.project.count({ where }),
      prisma.project.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    return sendSuccess(res, {
      items: serializeProjectRecords(projects),
      page,
      limit,
      total,
    });
  } catch (error) {
    console.error('GET /api/projects failed:', error);
    return sendError(res, {
      status: 500,
      code: 'PROJECTS_FETCH_FAILED',
      message: 'Failed to fetch projects',
      details: { reason: error?.message || 'Unknown database error' },
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: req.params.id },
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

    return sendSuccess(res, serializeProjectRecord(project));
  } catch (error) {
    console.error('GET /api/projects/:id failed:', error);
    return sendError(res, {
      status: 500,
      code: 'PROJECT_FETCH_FAILED',
      message: 'Failed to fetch project',
      details: { reason: error?.message || 'Unknown database error' },
    });
  }
});

router.post('/', async (req, res) => {
  const validation = validateCreateProjectPayload(req.body || {});
  if (!validation.isValid) {
    return sendError(res, {
      status: 400,
      code: 'VALIDATION_ERROR',
      message: 'Invalid project payload',
      details: validation.errors,
    });
  }

  try {
    const project = await prisma.project.create({
      data: {
        ...validation.data,
        tenantId: req.user.tenantId,
        userId: req.user.userId,
      },
    });

    return sendSuccess(res, serializeProjectRecord(project), 201);
  } catch (error) {
    console.error('POST /api/projects failed:', error);
    return sendError(res, {
      status: 500,
      code: 'PROJECT_CREATE_FAILED',
      message: 'Failed to create project',
      details: { reason: error?.message || 'Unknown database error' },
    });
  }
});

router.put('/:id', async (req, res) => {
  const validation = validateCreateProjectPayload({
    ...req.body,
    title: req.body?.title || req.body?.projectName,
  });

  if (!validation.isValid) {
    return sendError(res, {
      status: 400,
      code: 'VALIDATION_ERROR',
      message: 'Invalid project payload',
      details: validation.errors,
    });
  }

  try {
    const existingProject = await prisma.project.findUnique({
      where: { id: req.params.id },
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

    const project = await prisma.project.update({
      where: { id: req.params.id },
      data: validation.data,
    });

    return sendSuccess(res, serializeProjectRecord(project));
  } catch (error) {
    console.error('PUT /api/projects/:id failed:', error);
    const status = error?.code === 'P2025' ? 404 : 500;
    return sendError(res, {
      status,
      code: status === 404 ? 'PROJECT_NOT_FOUND' : 'PROJECT_UPDATE_FAILED',
      message: status === 404 ? 'Project not found' : 'Failed to update project',
      details: status === 500 ? { reason: error?.message || 'Unknown database error' } : undefined,
    });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const existingProject = await prisma.project.findUnique({
      where: { id: req.params.id },
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
        message: 'You do not have permission to delete this project',
      });
    }

    await prisma.project.delete({
      where: { id: req.params.id },
    });

    return sendSuccess(res, { message: 'Project deleted' });
  } catch (error) {
    console.error('DELETE /api/projects/:id failed:', error);
    const status = error?.code === 'P2025' ? 404 : 500;
    return sendError(res, {
      status,
      code: status === 404 ? 'PROJECT_NOT_FOUND' : 'PROJECT_DELETE_FAILED',
      message: status === 404 ? 'Project not found' : 'Failed to delete project',
      details: status === 500 ? { reason: error?.message || 'Unknown database error' } : undefined,
    });
  }
});

module.exports = router;
