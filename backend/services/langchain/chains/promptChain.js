const {
  PromptTemplate,
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate,
} = require('@langchain/core/prompts');
const { llmPrecise, llmCreative } = require('../llmConfig');
const { StringOutputParser } = require('@langchain/core/output_parsers');

// Optimization prompt template
const optimizationTemplate = ChatPromptTemplate.fromMessages([
  SystemMessagePromptTemplate.fromTemplate(
    `You are an expert AI prompt engineer. Your task is to enhance and optimize AI prompts.
    
    When optimizing a prompt, you should:
    1. Improve clarity and specificity
    2. Add context that helps the AI understand the goal better
    3. Include example output formats when helpful
    4. Remove ambiguities
    5. Suggest better instructions for the desired outcome
    
    Return the optimized prompt with a brief explanation of changes.`
  ),
  HumanMessagePromptTemplate.fromTemplate(
    `Original Prompt:
{original_prompt}

Project Context:
- Type: {projectType}
- Name: {projectName}
- Uses AI: {useAI}

Please optimize this prompt for better results. Format your response as:
OPTIMIZED PROMPT:
[the optimized prompt here]

IMPROVEMENTS:
[bullet points of changes made]`
  ),
]);

// Refinement chain for iterative improvement
const refinementTemplate = ChatPromptTemplate.fromMessages([
  SystemMessagePromptTemplate.fromTemplate(
    `You are an expert at refining AI prompts based on feedback.
    Your task is to improve the given prompt based on the user's feedback.`
  ),
  HumanMessagePromptTemplate.fromTemplate(
    `Current Prompt:
{currentPrompt}

User Feedback:
{feedback}

Please refine the prompt to address this feedback while maintaining its core purpose.
Return the refined prompt with a summary of changes.`
  ),
]);

// Validation chain to assess prompt quality
const validationTemplate = ChatPromptTemplate.fromMessages([
  SystemMessagePromptTemplate.fromTemplate(
    `You are an AI quality assurance expert. Assess the quality of the given prompt.
    
    Rate the prompt on:
    1. Clarity (0-10)
    2. Specificity (0-10)
    3. Structure (0-10)
    4. Context Completeness (0-10)
    5. Bias Potential (0-10, where 10 is no bias)
    
    Provide actionable suggestions for improvement.`
  ),
  HumanMessagePromptTemplate.fromTemplate(
    `Prompt to Evaluate:
{prompt}

Project Context:
- Type: {projectType}
- Name: {projectName}

Please provide a structured quality assessment.`
  ),
]);

// Create chains
const optimizationChain = optimizationTemplate
  .pipe(llmPrecise)
  .pipe(new StringOutputParser());

const refinementChain = refinementTemplate
  .pipe(llmCreative)
  .pipe(new StringOutputParser());

const validationChain = validationTemplate
  .pipe(llmPrecise)
  .pipe(new StringOutputParser());

/**
 * Optimize a prompt using LangChain
 * @param {string} prompt - Original prompt
 * @param {object} context - Project context
 * @returns {Promise<{optimizedPrompt: string, improvements: string}>}
 */
async function optimizePrompt(prompt, context) {
  try {
    const result = await optimizationChain.invoke({
      original_prompt: prompt,
      projectType: context.projectType || 'web',
      projectName: context.projectName || 'Untitled',
      useAI: context.useAI ? 'Yes' : 'No',
    });

    // Parse the response
    const sections = result.split('IMPROVEMENTS:');
    const optimizedPrompt = sections[0]
      .replace('OPTIMIZED PROMPT:', '')
      .trim();
    const improvements = sections[1] ? sections[1].trim() : '';

    return {
      optimizedPrompt,
      improvements,
      timestamp: new Date(),
    };
  } catch (error) {
    console.error('Error optimizing prompt:', error);
    throw error;
  }
}

/**
 * Refine a prompt based on feedback
 * @param {string} currentPrompt - Current prompt
 * @param {string} feedback - User feedback
 * @returns {Promise<{refinedPrompt: string, changes: string}>}
 */
async function refinePrompt(currentPrompt, feedback) {
  try {
    const result = await refinementChain.invoke({
      currentPrompt,
      feedback,
    });

    return {
      refinedPrompt: result,
      timestamp: new Date(),
    };
  } catch (error) {
    console.error('Error refining prompt:', error);
    throw error;
  }
}

/**
 * Validate prompt quality
 * @param {string} prompt - Prompt to validate
 * @param {object} context - Project context
 * @returns {Promise<{assessment: string, scores: object}>}
 */
async function validatePrompt(prompt, context) {
  try {
    const result = await validationChain.invoke({
      prompt,
      projectType: context.projectType || 'web',
      projectName: context.projectName || 'Untitled',
    });

    // Extract scores if available
    const scores = {};
    const lines = result.split('\n');
    
    lines.forEach((line) => {
      if (line.includes('Clarity')) scores.clarity = extractScore(line);
      if (line.includes('Specificity')) scores.specificity = extractScore(line);
      if (line.includes('Structure')) scores.structure = extractScore(line);
      if (line.includes('Context')) scores.contextCompleteness = extractScore(line);
      if (line.includes('Bias')) scores.biasReduction = extractScore(line);
    });

    return {
      assessment: result,
      scores,
      overallScore: Object.values(scores).length > 0 
        ? Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / Object.values(scores).length)
        : null,
      timestamp: new Date(),
    };
  } catch (error) {
    console.error('Error validating prompt:', error);
    throw error;
  }
}

/**
 * Extract numeric score from text
 * @param {string} text - Text containing score
 * @returns {number|null}
 */
function extractScore(text) {
  const match = text.match(/(\d+)\s*\/\s*10/);
  return match ? parseInt(match[1], 10) : null;
}

module.exports = {
  optimizePrompt,
  refinePrompt,
  validatePrompt,
  optimizationChain,
  refinementChain,
  validationChain,
};
