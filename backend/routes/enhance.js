const express = require('express');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const { validateGeneratePayload } = require('../contract/projectContract');
const authMiddleware = require('../middleware/authMiddleware');
const { prisma } = require('../prismaClient');

// Lazy-load heavy LangChain/LangGraph modules to prevent server crash if they
// fail to import (e.g. on Vercel serverless where bundling can break ESM deps).
let _generationWorkflow;
let _promptChain;
let _streamResponse;

function getGenerationWorkflow() {
  if (!_generationWorkflow) {
    _generationWorkflow = require('../services/langgraph/graphs/generationWorkflow');
  }
  return _generationWorkflow;
}

function getPromptChain() {
  if (!_promptChain) {
    _promptChain = require('../services/langchain/chains/promptChain');
  }
  return _promptChain;
}

function getStreamResponse() {
  if (!_streamResponse) {
    _streamResponse = require('../utils/streamResponse');
  }
  return _streamResponse;
}

const router = express.Router();
router.use(authMiddleware);

/**
 * POST /api/generate/advanced
 * Enhanced generation using LangGraph workflow
 */
router.post('/advanced', async (req, res) => {
  try {
    const validation = validateGeneratePayload(req.body || {});
    if (!validation.isValid) {
      return sendError(res, {
        status: 400,
        code: 'VALIDATION_ERROR',
        message: 'Invalid generation payload',
        details: validation.errors,
      });
    }

    const { executeGenerationWorkflow } = getGenerationWorkflow();
    const result = await executeGenerationWorkflow(req.body);
    return sendSuccess(res, {
      prompt: result.prompt,
      recommendations: result.recommendations,
      validation: result.validation,
      metadata: result.metadata,
    });
  } catch (error) {
    console.error('Advanced generation error:', error);
    return sendError(res, {
      status: 500,
      code: 'GENERATION_ERROR',
      message: 'Failed to run advanced generation',
      details: { reason: error?.message || 'Unknown error' },
    });
  }
});

/**
 * POST /api/generate/stream
 * Real-time streaming generation
 */
router.post('/stream', async (req, res) => {
  try {
    const validation = validateGeneratePayload(req.body || {});
    if (!validation.isValid) {
      return sendError(res, {
        status: 400,
        code: 'VALIDATION_ERROR',
        message: 'Invalid generation payload',
        details: validation.errors,
      });
    }

    const { streamWorkflowExecution } = getStreamResponse();
    const { executeGenerationWorkflow } = getGenerationWorkflow();
    await streamWorkflowExecution(res, executeGenerationWorkflow, req.body);
  } catch (error) {
    console.error('Stream generation error:', error);
  }
});

/**
 * POST /api/optimize
 * Optimize an existing prompt
 */
router.post('/optimize', async (req, res) => {
  try {
    const { prompt, context } = req.body;

    if (!prompt) {
      return sendError(res, {
        status: 400,
        code: 'VALIDATION_ERROR',
        message: 'Prompt is required',
        details: [{ field: 'prompt', message: 'prompt is required' }],
      });
    }

    const { optimizePrompt } = getPromptChain();
    const result = await optimizePrompt(prompt, context || {});
    return sendSuccess(res, {
      optimizedPrompt: result.optimizedPrompt,
      improvements: result.improvements,
    });
  } catch (error) {
    console.error('Optimization error:', error);
    return sendError(res, {
      status: 500,
      code: 'OPTIMIZATION_ERROR',
      message: 'Failed to optimize prompt',
      details: { reason: error?.message || 'Unknown optimization error' },
    });
  }
});

router.post('/refine', async (req, res) => {
  try {
    const { currentPrompt, feedback } = req.body;

    if (!currentPrompt || !feedback) {
      const details = [];
      if (!currentPrompt) details.push({ field: 'currentPrompt', message: 'currentPrompt is required' });
      if (!feedback) details.push({ field: 'feedback', message: 'feedback is required' });
      return sendError(res, {
        status: 400,
        code: 'VALIDATION_ERROR',
        message: 'currentPrompt and feedback are required',
        details,
      });
    }

    const { refinePrompt } = getPromptChain();
    const result = await refinePrompt(currentPrompt, feedback);
    return sendSuccess(res, {
      refinedPrompt: result.refinedPrompt,
    });
  } catch (error) {
    console.error('Refinement error:', error);
    return sendError(res, {
      status: 500,
      code: 'REFINEMENT_ERROR',
      message: 'Failed to refine prompt',
      details: { reason: error?.message || 'Unknown refinement error' },
    });
  }
});

router.post('/validate', async (req, res) => {
  try {
    const { prompt, context } = req.body;

    if (!prompt) {
      return sendError(res, {
        status: 400,
        code: 'VALIDATION_ERROR',
        message: 'Prompt is required',
        details: [{ field: 'prompt', message: 'prompt is required' }],
      });
    }

    const { validatePrompt } = getPromptChain();
    const result = await validatePrompt(prompt, context || {});
    return sendSuccess(res, {
      assessment: result.assessment,
      scores: result.scores,
      overallScore: result.overallScore,
    });
  } catch (error) {
    console.error('Validation error:', error);
    return sendError(res, {
      status: 500,
      code: 'PROMPT_VALIDATION_ERROR',
      message: 'Failed to validate prompt',
      details: { reason: error?.message || 'Unknown validation error' },
    });
  }
});

router.get('/insights/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await prisma.project.findUnique({
      where: { id: projectId },
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

    return sendSuccess(res, {
      projectId,
      insights: {
        complexity: 'medium',
        recommendations: [],
        bestPractices: [],
      },
    });
  } catch (error) {
    console.error('Insights error:', error);
    return sendError(res, {
      status: 500,
      code: 'INSIGHTS_ERROR',
      message: 'Failed to fetch insights',
      details: { reason: error?.message || 'Unknown error' },
    });
  }
});

module.exports = router;
