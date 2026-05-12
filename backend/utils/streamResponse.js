/**
 * Stream response helper for Server-Sent Events
 */
function setupStreamResponse(res) {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');
}

/**
 * Send SSE event
 */
function sendEvent(res, eventType, data) {
  res.write(`event: ${eventType}\n`);
  res.write(`data: ${JSON.stringify(data)}\n\n`);
}

/**
 * Send workflow stage update
 */
function sendStageUpdate(res, stage, message, progress = 0) {
  sendEvent(res, 'stage_update', {
    stage,
    message,
    progress,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Send progress update
 */
function sendProgress(res, current, total, message) {
  const percentage = Math.round((current / total) * 100);
  sendEvent(res, 'progress', {
    current,
    total,
    percentage,
    message,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Send data chunk
 */
function sendDataChunk(res, chunkType, data) {
  sendEvent(res, `data:${chunkType}`, {
    type: chunkType,
    data,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Send error event
 */
function sendError(res, error) {
  sendEvent(res, 'error', {
    message: error.message || 'Unknown error',
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Send completion event
 */
function sendCompletion(res, finalData) {
  sendEvent(res, 'complete', {
    result: finalData,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Stream workflow execution
 */
async function streamWorkflowExecution(res, workflowFn, ...args) {
  try {
    setupStreamResponse(res);
    sendStageUpdate(res, 'started', 'Workflow execution started', 0);

    let progress = 0;
    const stages = [
      { name: 'analyze_input', percent: 10 },
      { name: 'generate_prompt', percent: 25 },
      { name: 'optimize_prompt', percent: 40 },
      { name: 'validate_prompt', percent: 55 },
      { name: 'validate_tech_stack', percent: 70 },
      { name: 'generate_recommendations', percent: 85 },
      { name: 'compile_results', percent: 100 },
    ];

    // If the function is an async generator (streaming)
    if (workflowFn.constructor.name === 'AsyncGeneratorFunction') {
      for await (const step of workflowFn(...args)) {
        // Extract stage info
        const [nodeName, nodeOutput] = Object.entries(step)[0] || [];
        const stageInfo = stages.find((s) => s.name === nodeName);

        if (stageInfo) {
          sendStageUpdate(res, nodeName, `Executing ${nodeName}`, stageInfo.percent);
          progress = stageInfo.percent;
        }

        // Send node-specific data
        if (nodeOutput) {
          sendDataChunk(res, nodeName, nodeOutput);
        }
      }
    } else {
      // For non-streaming workflows
      const result = await workflowFn(...args);
      stages.forEach((stage) => {
        sendStageUpdate(res, stage.name, `Completed ${stage.name}`, stage.percent);
      });
      sendCompletion(res, result);
    }

    res.write(`event: done\ndata: {}\n\n`);
    res.end();
  } catch (error) {
    console.error('Streaming error:', error);
    sendError(res, error);
    res.write(`event: done\ndata: {}\n\n`);
    res.end();
  }
}

module.exports = {
  setupStreamResponse,
  sendEvent,
  sendStageUpdate,
  sendProgress,
  sendDataChunk,
  sendError,
  sendCompletion,
  streamWorkflowExecution,
};
