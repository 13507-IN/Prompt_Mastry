const { ChatOpenAI } = require('@langchain/openai');
const { AgentExecutor, createToolCallingAgent } = require('langchain/agents');
const { ChatPromptTemplate, MessagesPlaceholder } = require('@langchain/core/prompts');
const {
  validateTechStackTool,
  suggestBestPracticesTool,
  getAlternativesTool,
} = require('../tools/techStackValidator');

// Initialize LLM for agent
const llm = new ChatOpenAI({
  modelName: process.env.OPENAI_MODEL || 'gpt-4-turbo',
  temperature: 0.7,
});

// Agent tools
const tools = [validateTechStackTool, suggestBestPracticesTool, getAlternativesTool];

// Agent prompt template
const agentPrompt = ChatPromptTemplate.fromMessages([
  [
    'system',
    `You are a senior software architect helping developers choose the right tech stack for their projects.

Your responsibilities:
1. Validate tech stack choices for compatibility
2. Suggest best practices for the selected technologies
3. Provide alternative options when appropriate
4. Explain the reasoning behind recommendations

Always validate the tech stack first, then provide best practices, and offer alternatives if they ask.
Be friendly, informative, and provide reasoning for all recommendations.`,
  ],
  new MessagesPlaceholder('chat_history'),
  ['human', '{input}'],
  new MessagesPlaceholder('agent_scratchpad'),
]);

/**
 * Create and initialize the recommendation agent
 */
async function initializeRecommendationAgent() {
  const agent = await createToolCallingAgent({
    llm,
    tools,
    prompt: agentPrompt,
  });

  return new AgentExecutor({
    agent,
    tools,
    verbose: true,
    maxIterations: 10,
  });
}

/**
 * Get recommendations for a project
 * @param {object} projectData - Project configuration
 * @returns {Promise<{recommendations: string, validation: object, bestPractices: array}>}
 */
async function getRecommendations(projectData) {
  try {
    const agentExecutor = await initializeRecommendationAgent();

    const input = `
I'm building a ${projectData.projectType} project with these tech choices:
- Framework: ${projectData.framework || 'Not selected'}
- ORM: ${projectData.ormChoice || 'Not selected'}
- Database: ${projectData.dbProvider || 'Not selected'}
- Deployment: ${projectData.deploymentPlatform || 'Not selected'}
- Requires Auth: ${projectData.authRequired ? 'Yes' : 'No'}

Please:
1. Validate if these choices work well together
2. Provide best practices for this stack
3. Suggest alternatives if there are any issues
4. Give me reasoning for your recommendations
    `;

    const result = await agentExecutor.invoke({
      input,
      chat_history: [],
    });

    return {
      recommendations: result.output,
      reasoning: result.output,
      timestamp: new Date(),
    };
  } catch (error) {
    console.error('Error getting recommendations:', error);
    throw error;
  }
}

/**
 * Quick validation for tech stack
 * @param {object} stack - Tech stack to validate
 * @returns {Promise<object>}
 */
async function quickValidate(stack) {
  try {
    const agentExecutor = await initializeRecommendationAgent();

    const input = `
Quickly validate this tech stack for compatibility issues:
- Framework: ${stack.framework || 'None'}
- ORM: ${stack.orm || 'None'}
- Database: ${stack.database || 'None'}
- Deployment: ${stack.deployment || 'None'}

Focus on compatibility issues and critical warnings.
    `;

    const result = await agentExecutor.invoke({
      input,
      chat_history: [],
    });

    return {
      validation: result.output,
      issues: extractIssues(result.output),
      warnings: extractWarnings(result.output),
    };
  } catch (error) {
    console.error('Error in quick validation:', error);
    throw error;
  }
}

/**
 * Get detailed reasoning for recommendations
 * @param {object} projectData - Project configuration
 * @param {string} questionType - Type of question (e.g., 'framework', 'database')
 * @returns {Promise<string>}
 */
async function getDetailedReasoning(projectData, questionType) {
  try {
    const agentExecutor = await initializeRecommendationAgent();

    const input = `
For my ${projectData.projectType} project, I want to understand:
- Current choice for ${questionType}: ${projectData[questionType] || 'Not selected'}
- Project name: ${projectData.projectName}
- Other choices: ${JSON.stringify(projectData).substring(0, 200)}

Please provide detailed reasoning for ${questionType} choice, including:
1. Why it's a good fit
2. Trade-offs compared to alternatives
3. When to consider alternatives
4. Best practices for this choice
    `;

    const result = await agentExecutor.invoke({
      input,
      chat_history: [],
    });

    return result.output;
  } catch (error) {
    console.error('Error getting detailed reasoning:', error);
    throw error;
  }
}

/**
 * Extract issues from agent output
 */
function extractIssues(output) {
  const issues = [];
  const lines = output.split('\n');
  const issueKeywords = ['issue', 'problem', 'incompatible', 'conflict', 'error'];

  lines.forEach((line) => {
    if (issueKeywords.some((keyword) => line.toLowerCase().includes(keyword))) {
      issues.push(line.trim());
    }
  });

  return issues;
}

/**
 * Extract warnings from agent output
 */
function extractWarnings(output) {
  const warnings = [];
  const lines = output.split('\n');
  const warningKeywords = ['warning', 'caution', 'note', 'careful', 'consider'];

  lines.forEach((line) => {
    if (warningKeywords.some((keyword) => line.toLowerCase().includes(keyword))) {
      warnings.push(line.trim());
    }
  });

  return warnings;
}

module.exports = {
  getRecommendations,
  quickValidate,
  getDetailedReasoning,
  initializeRecommendationAgent,
};
