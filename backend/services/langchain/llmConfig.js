const { ChatOpenAI } = require('@langchain/openai');

// Initialize LLM instances with different configurations
const llmFast = new ChatOpenAI({
  modelName: process.env.OPENAI_MODEL || 'gpt-4-turbo',
  temperature: 0.7,
  maxTokens: 2000,
});

const llmPrecise = new ChatOpenAI({
  modelName: process.env.OPENAI_MODEL || 'gpt-4-turbo',
  temperature: 0.3,
  maxTokens: 3000,
});

const llmCreative = new ChatOpenAI({
  modelName: process.env.OPENAI_MODEL || 'gpt-4-turbo',
  temperature: 0.9,
  maxTokens: 2500,
});

const llmStreaming = new ChatOpenAI({
  modelName: process.env.OPENAI_MODEL || 'gpt-4-turbo',
  temperature: 0.7,
  streaming: true,
});

module.exports = {
  llmFast,
  llmPrecise,
  llmCreative,
  llmStreaming,
};
