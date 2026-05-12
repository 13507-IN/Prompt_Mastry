# LangChain Integration Quick Start

## Prerequisites
- Node.js 18+
- OpenAI API Key
- PostgreSQL (existing)

## Setup Steps

### 1. Install Dependencies
```bash
cd backend
npm install
```

The new dependencies added:
- `langchain` - Core framework
- `@langchain/openai` - OpenAI integration
- `@langchain/langgraph` - Graph orchestration
- `@langchain/community` - Community tools
- `node-cache` - Caching support

### 2. Configure Environment
```bash
# Copy and update the .env file
cp .env.example .env
```

Add your OpenAI API key:
```bash
OPENAI_API_KEY=sk-your-key-here
OPENAI_MODEL=gpt-4-turbo
```

### 3. Start the Server
```bash
npm run dev
```

The new endpoints will be available at `http://localhost:5000/api/enhance/*`

## Quick Test

### Test Prompt Optimization
```bash
curl -X POST http://localhost:5000/api/enhance/optimize \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Create a web app",
    "context": {
      "projectName": "TestApp",
      "projectType": "web"
    }
  }'
```

### Test Advanced Generation
```bash
curl -X POST http://localhost:5000/api/enhance/advanced \
  -H "Content-Type: application/json" \
  -d '{
    "projectName": "TestApp",
    "projectType": "web",
    "framework": "Next.js",
    "ormChoice": "Prisma",
    "dbProvider": "PostgreSQL",
    "deploymentPlatform": "Vercel",
    "useAI": true
  }'
```

### Test Streaming
```bash
curl -X POST http://localhost:5000/api/enhance/stream \
  -H "Content-Type: application/json" \
  -d '{
    "projectName": "TestApp",
    "projectType": "web",
    "framework": "Next.js",
    "ormChoice": "Prisma",
    "dbProvider": "PostgreSQL"
  }'
```

## Frontend Integration

### 1. Update the Builder Component
```tsx
// In your builder component
import { useEnhancedGeneration } from '@/hooks/useEnhancedGeneration';

export function Builder() {
  const { generate, loading, result } = useEnhancedGeneration();

  const handleGenerate = async (data) => {
    const result = await generate(data);
    // Use result
  };

  return (
    // Your UI
  );
}
```

### 2. Create a Hook for Generation
```tsx
// hooks/useEnhancedGeneration.ts
import { useState } from 'react';

export function useEnhancedGeneration() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const generate = async (projectData) => {
    setLoading(true);
    try {
      const response = await fetch('/api/enhance/advanced', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData)
      });
      const data = await response.json();
      setResult(data.data);
      return data.data;
    } finally {
      setLoading(false);
    }
  };

  return { generate, loading, result };
}
```

### 3. Update Results View
```tsx
// Show the optimized prompt with quality scores
export function ResultsView({ data }) {
  return (
    <div className="space-y-6">
      {/* Prompt Display */}
      <PromptCard prompt={data.prompt} />

      {/* Quality Scores */}
      {data.validation?.prompt?.scores && (
        <QualityScores scores={data.validation.prompt.scores} />
      )}

      {/* Tech Stack Validation */}
      {data.validation?.techStack && (
        <TechStackValidation validation={data.validation.techStack} />
      )}

      {/* Recommendations */}
      <RecommendationsList recommendations={data.recommendations} />

      {/* Optimizer Panel */}
      <PromptOptimizer prompt={data.prompt} />
    </div>
  );
}
```

## API Reference

### POST /api/enhance/advanced
Full-featured generation with optimization

### POST /api/enhance/stream
Real-time streaming generation

### POST /api/enhance/optimize
Optimize existing prompt

### POST /api/enhance/refine
Refine based on feedback

### POST /api/enhance/validate
Check prompt quality

## Key Features

✨ **Multi-stage Optimization** - LangGraph orchestrates 7 stages  
🤖 **AI Agent Recommendations** - Tool-using agent provides insights  
✓ **Quality Validation** - Automated scoring across 5 dimensions  
⚡ **Real-time Streaming** - SSE for live progress updates  
🔄 **Iterative Refinement** - Feedback-based improvement loop  
🛡️ **Tech Stack Validation** - Compatibility checking  
💾 **Template Fallback** - Graceful degradation if API fails  

## Common Issues

### "Module not found: langchain"
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### "OPENAI_API_KEY not found"
```bash
# Check your .env file
cat .env | grep OPENAI_API_KEY
```

### "403 API key invalid"
- Verify your OpenAI API key at https://platform.openai.com
- Check for typos
- Ensure key has sufficient quota

### Slow responses
- Check OpenAI rate limits
- Use smaller models for testing (`gpt-3.5-turbo`)
- Enable streaming for better UX

## Performance Tips

1. **Use Streaming for UX**
   - Real-time progress updates
   - Better perceived performance

2. **Cache Responses**
   - Identical inputs = cached output
   - Reduces API calls

3. **Optimize Context**
   - Provide only necessary project details
   - Reduces token usage

4. **Use Appropriate Temperature**
   - 0.3 for consistency
   - 0.7 for balance
   - 0.9 for creativity

## Next Steps

1. Deploy with proper API key management
2. Implement user feedback collection
3. Add caching layer (Redis)
4. Set up monitoring and observability
5. Implement rate limiting per user
6. Add conversation history

## Documentation

- [Full LangChain Services Docs](./LANGCHAIN_SERVICES.md)
- [Frontend Integration Guide](./FRONTEND_INTEGRATION.md)
- [Enhancement Roadmap](./LANGCHAIN_ENHANCEMENT_PLAN.md)

## Support

For issues or questions:
1. Check the [troubleshooting guide](./LANGCHAIN_SERVICES.md#troubleshooting)
2. Review API response errors
3. Check OpenAI API status at https://status.openai.com

