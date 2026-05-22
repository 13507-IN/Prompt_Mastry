const { StateGraph, START, END } = require('@langchain/langgraph');
const { optimizePrompt, validatePrompt } = require('../../langchain/chains/promptChain');
const { getRecommendations, quickValidate } = require('../../langchain/agents/recommendationAgent');
const { generatePrompt } = require('../../../utils/promptGenerator');
const { generateRecommendations } = require('../../../utils/recommendations');

// Define the state schema
class GenerationState {
  constructor() {
    this.projectData = {};
    this.initialPrompt = '';
    this.optimizedPrompt = '';
    this.promptValidation = {};
    this.recommendations = '';
    this.techStackValidation = {};
    this.errors = [];
    this.stage = 'initialized';
  }
}

/**
 * Node: Analyze and validate input
 */
async function analyzeInputNode(state) {
  const newState = { ...state };
  try {
    // Validate required fields
    if (!state.projectData.projectName) {
      throw new Error('Project name is required');
    }

    newState.stage = 'input_validated';
    return newState;
  } catch (error) {
    newState.errors.push(`Analysis Error: ${error.message}`);
    return newState;
  }
}

/**
 * Node: Generate initial prompt
 */
async function generatePromptNode(state) {
  const newState = { ...state };
  try {
    const prompt = generatePrompt(state.projectData);
    newState.initialPrompt = prompt;
    newState.stage = 'prompt_generated';
    return newState;
  } catch (error) {
    newState.errors.push(`Prompt Generation Error: ${error.message}`);
    return newState;
  }
}

/**
 * Node: Optimize prompt using LLM
 */
async function optimizePromptNode(state) {
  const newState = { ...state };
  try {
    if (!state.initialPrompt) {
      throw new Error('No initial prompt to optimize');
    }

    const optimization = await optimizePrompt(state.initialPrompt, state.projectData);
    newState.optimizedPrompt = optimization.optimizedPrompt;
    newState.optimizationNotes = optimization.improvements;
    newState.stage = 'prompt_optimized';
    return newState;
  } catch (error) {
    console.warn('Optimization failed, using original:', error.message);
    newState.optimizedPrompt = state.initialPrompt;
    newState.errors.push(`Optimization Warning: ${error.message}`);
    return newState;
  }
}

/**
 * Node: Validate prompt quality
 */
async function validatePromptNode(state) {
  const newState = { ...state };
  try {
    const prompt = state.optimizedPrompt || state.initialPrompt;
    const validation = await validatePrompt(prompt, state.projectData);
    newState.promptValidation = validation;
    newState.stage = 'prompt_validated';
    return newState;
  } catch (error) {
    console.warn('Validation failed:', error.message);
    newState.promptValidation = { error: error.message };
    return newState;
  }
}

/**
 * Node: Validate tech stack
 */
async function validateTechStackNode(state) {
  const newState = { ...state };
  try {
    const validation = await quickValidate({
      framework: state.projectData.framework,
      orm: state.projectData.ormChoice,
      database: state.projectData.dbProvider,
      deployment: state.projectData.deploymentPlatform,
    });
    newState.techStackValidation = validation;
    newState.stage = 'tech_stack_validated';
    return newState;
  } catch (error) {
    console.warn('Tech stack validation failed:', error.message);
    newState.errors.push(`Tech Stack Validation: ${error.message}`);
    return newState;
  }
}

/**
 * Node: Generate AI-powered recommendations
 */
async function generateRecommendationsNode(state) {
  const newState = { ...state };
  try {
    // Get both template-based and AI-based recommendations
    const templateRecommendations = generateRecommendations(state.projectData);
    const aiRecommendations = await getRecommendations(state.projectData);

    newState.recommendations = {
      template: templateRecommendations,
      ai: aiRecommendations,
      combined: [...templateRecommendations, aiRecommendations.recommendations],
    };

    newState.stage = 'recommendations_generated';
    return newState;
  } catch (error) {
    console.warn('AI recommendations failed, using template only:', error.message);
    const templateRecommendations = generateRecommendations(state.projectData);
    newState.recommendations = {
      template: templateRecommendations,
      ai: null,
      combined: templateRecommendations,
    };
    newState.errors.push(`Recommendation Error: ${error.message}`);
    return newState;
  }
}

/**
 * Node: Compile final results
 */
async function compileResultsNode(state) {
  const newState = { ...state };
  try {
    newState.finalResult = {
      prompt: newState.optimizedPrompt || newState.initialPrompt,
      recommendations: newState.recommendations?.combined || [],
      validation: {
        prompt: newState.promptValidation,
        techStack: newState.techStackValidation,
      },
      metadata: {
        stage: 'completed',
        timestamp: new Date(),
        projectName: newState.projectData.projectName,
        errors: newState.errors,
      },
    };
    newState.stage = 'completed';
    return newState;
  } catch (error) {
    newState.errors.push(`Compilation Error: ${error.message}`);
    return newState;
  }
}

/**
 * Conditional edge: Check for errors
 */
function shouldContinue(state) {
  if (state.errors.length > 0 && state.stage !== 'completed') {
    return 'compile_results';
  }
  return 'continue';
}

/**
 * Build the generation workflow graph
 */
function buildGenerationWorkflow() {
  const workflow = new StateGraph(GenerationState);

  // Add nodes
  workflow.addNode('analyze_input', analyzeInputNode);
  workflow.addNode('generate_prompt', generatePromptNode);
  workflow.addNode('optimize_prompt', optimizePromptNode);
  workflow.addNode('validate_prompt', validatePromptNode);
  workflow.addNode('validate_tech_stack', validateTechStackNode);
  workflow.addNode('generate_recommendations', generateRecommendationsNode);
  workflow.addNode('compile_results', compileResultsNode);

  // Add edges
  workflow.addEdge(START, 'analyze_input');
  workflow.addEdge('analyze_input', 'generate_prompt');
  workflow.addEdge('generate_prompt', 'optimize_prompt');
  workflow.addEdge('optimize_prompt', 'validate_prompt');
  workflow.addEdge('validate_prompt', 'validate_tech_stack');
  workflow.addEdge('validate_tech_stack', 'generate_recommendations');
  workflow.addEdge('generate_recommendations', 'compile_results');
  workflow.addEdge('compile_results', END);

  return workflow.compile();
}

/**
 * Execute the generation workflow
 * @param {object} projectData - Project configuration
 * @returns {Promise<object>}
 */
async function executeGenerationWorkflow(projectData) {
  try {
    const graph = buildGenerationWorkflow();
    const initialState = {
      projectData,
      initialPrompt: '',
      optimizedPrompt: '',
      promptValidation: {},
      recommendations: '',
      techStackValidation: {},
      errors: [],
      stage: 'initialized',
    };

    const result = await graph.invoke(initialState);
    return result.finalResult;
  } catch (error) {
    console.error('Workflow execution error:', error);
    throw error;
  }
}

/**
 * Create a streaming version for real-time updates
 */
async function* streamGenerationWorkflow(projectData) {
  try {
    const graph = buildGenerationWorkflow();
    const initialState = {
      projectData,
      initialPrompt: '',
      optimizedPrompt: '',
      promptValidation: {},
      recommendations: '',
      techStackValidation: {},
      errors: [],
      stage: 'initialized',
    };

    for await (const step of await graph.stream(initialState)) {
      yield step;
    }
  } catch (error) {
    console.error('Streaming workflow error:', error);
    throw error;
  }
}

module.exports = {
  GenerationState,
  buildGenerationWorkflow,
  executeGenerationWorkflow,
  streamGenerationWorkflow,
  // Export nodes for testing
  analyzeInputNode,
  generatePromptNode,
  optimizePromptNode,
  validatePromptNode,
  validateTechStackNode,
  generateRecommendationsNode,
  compileResultsNode,
};
