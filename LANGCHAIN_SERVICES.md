# LangChain & LangGraph Services Documentation

## Overview

This document explains the new LangChain and LangGraph services added to Prompt Mastry for intelligent, AI-powered prompt generation and analysis.

## Architecture

### Directory Structure
```
backend/services/
├── langchain/
│   ├── chains/
│   │   └── promptChain.js          # Prompt optimization, refinement, validation
│   ├── agents/
│   │   └── recommendationAgent.js  # Tech stack recommendations agent
│   ├── tools/
│   │   └── techStackValidator.js   # Compatibility checking tools
│   ├── memory/
│   │   └── (future: conversation memory)
│   └── llmConfig.js                # LLM initialization and config
└── langgraph/
    ├── graphs/
    │   └── generationWorkflow.js   # Multi-stage generation orchestration
    └── nodes/
        └── (future: individual node implementations)
```

## Key Services

### 1. LLM Configuration (`llmConfig.js`)

Provides pre-configured LLM instances with different settings:

- **llmFast**: Low temperature (0.7), 2000 tokens - for deterministic outputs
- **llmPrecise**: Low temperature (0.3), 3000 tokens - for precise, factual content
- **llmCreative**: High temperature (0.9), 2500 tokens - for creative suggestions
- **llmStreaming**: Streaming enabled - for real-time output

**Usage:**
```javascript
const { llmPrecise, llmCreative } = require('./services/langchain/llmConfig');

// Use in chains
const chain = promptTemplate.pipe(llmPrecise);
```

### 2. Prompt Chains (`chains/promptChain.js`)

#### optimizePrompt(prompt, context)
Enhances a prompt using LLM for better results.

**Features:**
- Improved clarity and specificity
- Better context understanding
- Removal of ambiguities
- Format suggestions

**Example:**
```javascript
const { optimizePrompt } = require('./services/langchain/chains/promptChain');

const result = await optimizePrompt(userPrompt, {
  projectName: 'MyApp',
  projectType: 'web',
  useAI: true
});

console.log(result.optimizedPrompt);
console.log(result.improvements);
```

#### refinePrompt(currentPrompt, feedback)
Iteratively improves a prompt based on user feedback.

**Example:**
```javascript
const refined = await refinePrompt(
  currentPrompt,
  'Make it more specific about error handling'
);
```

#### validatePrompt(prompt, context)
Assesses prompt quality across multiple dimensions.

**Returns:**
```javascript
{
  assessment: "Detailed quality assessment...",
  scores: {
    clarity: 8,
    specificity: 7,
    structure: 9,
    contextCompleteness: 7,
    biasReduction: 9
  },
  overallScore: 8
}
```

### 3. Tech Stack Validator Tools (`tools/techStackValidator.js`)

#### validateTechStackTool
Validates compatibility between tech choices.

**Example:**
```javascript
const result = await validateTechStackTool.invoke({
  framework: 'Next.js',
  orm: 'Prisma',
  database: 'PostgreSQL',
  deploymentPlatform: 'Vercel'
});

// Returns:
// {
//   isCompatible: true,
//   issues: [],
//   warnings: [],
//   recommendations: ["✓ Your Prisma + PostgreSQL combination is well-supported"]
// }
```

#### suggestBestPracticesTool
Provides best practices for the selected stack.

#### getAlternativesTool
Suggests alternative options for a tech choice.

### 4. Recommendation Agent (`agents/recommendationAgent.js`)

Intelligent agent that uses tools to provide comprehensive tech stack recommendations.

#### getRecommendations(projectData)
Comprehensive analysis and recommendations.

**Example:**
```javascript
const { getRecommendations } = require('./services/langchain/agents/recommendationAgent');

const recommendations = await getRecommendations({
  projectType: 'web',
  projectName: 'MyApp',
  framework: 'Next.js',
  ormChoice: 'Prisma',
  dbProvider: 'PostgreSQL',
  deploymentPlatform: 'Vercel',
  authRequired: true
});

console.log(recommendations.recommendations);
console.log(recommendations.reasoning);
```

#### quickValidate(stack)
Fast compatibility check.

#### getDetailedReasoning(projectData, questionType)
Detailed explanation for a specific tech choice.

### 5. Generation Workflow (`langgraph/graphs/generationWorkflow.js`)

Multi-stage orchestration using LangGraph for end-to-end prompt generation.

#### Workflow Stages:
1. **Analyze Input** - Validate project data
2. **Generate Prompt** - Create initial prompt
3. **Optimize Prompt** - Enhance with LLM
4. **Validate Prompt** - Check quality
5. **Validate Tech Stack** - Check compatibility
6. **Generate Recommendations** - AI-powered suggestions
7. **Compile Results** - Assemble final output

#### executeGenerationWorkflow(projectData)
Execute the complete workflow.

**Example:**
```javascript
const { executeGenerationWorkflow } = require('./services/langgraph/graphs/generationWorkflow');

const result = await executeGenerationWorkflow(projectData);

console.log(result.prompt);
console.log(result.recommendations);
console.log(result.validation);
```

#### streamGenerationWorkflow(projectData)
Streaming version for real-time updates.

**Example:**
```javascript
for await (const step of streamGenerationWorkflow(projectData)) {
  const [nodeName, nodeOutput] = Object.entries(step)[0];
  console.log(`Executing: ${nodeName}`);
  console.log(nodeOutput);
}
```

## API Endpoints

### POST /api/enhance/advanced
Advanced generation using LangGraph workflow.

### POST /api/enhance/stream
Streaming generation with real-time updates.

### POST /api/enhance/optimize
Optimize an existing prompt.

### POST /api/enhance/refine
Refine based on feedback.

### POST /api/enhance/validate
Validate prompt quality.

## Configuration

### Environment Variables
```bash
# OpenAI
OPENAI_API_KEY=sk-your-key
OPENAI_MODEL=gpt-4-turbo

# LangChain Tracing (Optional)
LANGCHAIN_TRACING_V2=true
LANGCHAIN_PROJECT=prompt-mastry
LANGCHAIN_API_KEY=your-api-key

# Feature Flags
ENABLE_ADVANCED_GENERATION=true
ENABLE_STREAMING=true
ENABLE_OPTIMIZATION=true
```

## Error Handling

All services include comprehensive error handling:

```javascript
try {
  const result = await optimizePrompt(prompt, context);
} catch (error) {
  console.error('Optimization failed:', error.message);
  // Graceful fallback to original prompt
}
```

## Performance Optimization

### Caching
- Cache LLM responses for identical inputs
- Implement request deduplication
- Use connection pooling for database

### Streaming
- Use streaming endpoints for long-running operations
- Real-time updates for UX
- Reduced perceived latency

### Rate Limiting
- Built-in rate limiting on `/api/enhance` routes
- Prevents API abuse
- Configurable limits per endpoint

## Extending the System

### Adding New Tools
```javascript
const { tool } = require('@langchain/core/tools');
const { z } = require('zod');

const myTool = tool(
  async (input) => {
    // Implementation
    return result;
  },
  {
    name: 'my_tool',
    description: 'What this tool does',
    schema: z.object({
      param1: z.string(),
      param2: z.number()
    })
  }
);
```

### Adding New Chains
```javascript
const { ChatPromptTemplate } = require('@langchain/core/prompts');
const { llmPrecise } = require('../llmConfig');

const template = ChatPromptTemplate.fromTemplate('...');
const chain = template.pipe(llmPrecise);
```

### Adding New Workflow Nodes
```javascript
async function myNode(state) {
  // Process state
  return { ...state, newField: value };
}

// Add to graph
workflow.addNode('my_node', myNode);
```

## Monitoring & Observability

### LangChain Tracing
Enable in `.env`:
```bash
LANGCHAIN_TRACING_V2=true
LANGCHAIN_API_KEY=your-key
```

View traces at: https://smith.langchain.com

### Logging
```javascript
console.log('Stage:', state.stage);
console.log('Errors:', state.errors);
```

## Best Practices

1. **Always handle API errors** - Use try-catch blocks
2. **Implement timeouts** - Prevent hanging requests
3. **Cache responses** - Reduce API calls
4. **Use appropriate LLM instances** - Match temperature to use case
5. **Test with real data** - Validate with actual project configurations
6. **Monitor costs** - Track OpenAI API usage
7. **Provide fallbacks** - Use template-based generation as backup

## Future Enhancements

- [ ] Vector embeddings for RAG
- [ ] Conversation memory for multi-turn interactions
- [ ] Custom prompt templates per project type
- [ ] A/B testing different optimization strategies
- [ ] User feedback collection and learning
- [ ] Caching layer with Redis
- [ ] Rate limiting with tiered plans
- [ ] Prompt history and versioning

## Troubleshooting

### "OPENAI_API_KEY not found"
Set the environment variable in `.env`

### Slow responses
- Check API rate limits
- Enable caching
- Use streaming for long operations

### Inconsistent results
- Lower temperature for consistency
- Provide more context
- Use `llmPrecise` instead of `llmCreative`

## Support & Examples

See [FRONTEND_INTEGRATION.md](./FRONTEND_INTEGRATION.md) for frontend integration examples.

See [LANGCHAIN_ENHANCEMENT_PLAN.md](./LANGCHAIN_ENHANCEMENT_PLAN.md) for the full enhancement roadmap.

