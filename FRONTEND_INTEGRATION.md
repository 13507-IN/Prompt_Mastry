# Frontend Integration Guide for LangChain Features

## New API Endpoints

### 1. Advanced Generation with Workflow
```
POST /api/enhance/advanced
```

**Request:**
```json
{
  "projectName": "My App",
  "projectType": "web",
  "framework": "Next.js",
  "ormChoice": "Prisma",
  "dbProvider": "PostgreSQL",
  "deploymentPlatform": "Vercel",
  "useAI": true,
  "generationMode": "balanced"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "prompt": "# Optimized prompt here...",
    "recommendations": [
      "Use TypeScript for type safety",
      "Implement API middleware for auth",
      "..."
    ],
    "validation": {
      "prompt": {
        "scores": {
          "clarity": 9,
          "specificity": 8,
          "structure": 9,
          "contextCompleteness": 8,
          "biasReduction": 10
        },
        "overallScore": 9
      },
      "techStack": {
        "isCompatible": true,
        "issues": [],
        "warnings": []
      }
    },
    "metadata": {
      "stage": "completed",
      "timestamp": "2024-01-15T10:30:00Z"
    }
  }
}
```

### 2. Real-time Streaming Generation
```
POST /api/enhance/stream
```

**Request:** Same as advanced generation

**Response:** Server-Sent Events stream

```
event: stage_update
data: {"stage":"analyze_input","message":"Analyzing input","progress":10}

event: stage_update
data: {"stage":"generate_prompt","message":"Generating prompt","progress":25}

event: data:generate_prompt
data: {"type":"generate_prompt","data":{"initialPrompt":"..."}}

event: stage_update
data: {"stage":"optimize_prompt","message":"Optimizing prompt","progress":40}

...

event: complete
data: {"result":{...}}

event: done
data: {}
```

**Frontend Usage:**
```javascript
const eventSource = new EventSource('/api/enhance/stream', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(projectData)
});

eventSource.addEventListener('stage_update', (e) => {
  const { stage, message, progress } = JSON.parse(e.data);
  console.log(`${stage}: ${message} (${progress}%)`);
  updateProgressUI(progress);
});

eventSource.addEventListener('data:optimize_prompt', (e) => {
  const { data } = JSON.parse(e.data);
  updatePromptDisplay(data.optimizedPrompt);
});

eventSource.addEventListener('complete', (e) => {
  const { result } = JSON.parse(e.data);
  displayFinalResults(result);
});
```

### 3. Optimize Existing Prompt
```
POST /api/enhance/optimize
```

**Request:**
```json
{
  "prompt": "Your current prompt here",
  "context": {
    "projectName": "My App",
    "projectType": "web"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "optimizedPrompt": "Improved prompt text...",
    "improvements": [
      "- Added specific output format",
      "- Clarified edge cases",
      "- Removed ambiguity"
    ]
  }
}
```

### 4. Refine Prompt with Feedback
```
POST /api/enhance/refine
```

**Request:**
```json
{
  "currentPrompt": "Your prompt...",
  "feedback": "Make it more specific about error handling"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "refinedPrompt": "Updated prompt with error handling details..."
  }
}
```

### 5. Validate Prompt Quality
```
POST /api/enhance/validate
```

**Request:**
```json
{
  "prompt": "Your prompt to validate",
  "context": {
    "projectName": "My App",
    "projectType": "web"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "assessment": "Detailed quality assessment...",
    "scores": {
      "clarity": 8,
      "specificity": 7,
      "structure": 9,
      "contextCompleteness": 7,
      "biasReduction": 9
    },
    "overallScore": 8
  }
}
```

## Frontend Component Suggestions

### 1. Real-time Generation Indicator
```tsx
interface GenerationStage {
  stage: string;
  message: string;
  progress: number;
}

export function StreamingGenerationIndicator() {
  const [stages, setStages] = useState<GenerationStage[]>([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const eventSource = new EventSource('/api/enhance/stream', {
      // configuration...
    });

    eventSource.addEventListener('stage_update', (e) => {
      const stage = JSON.parse(e.data);
      setStages(prev => [...prev, stage]);
      setProgress(stage.progress);
    });

    return () => eventSource.close();
  }, []);

  return (
    <div className="space-y-4">
      <ProgressBar value={progress} max={100} />
      {stages.map((stage) => (
        <StageItem key={stage.stage} stage={stage} />
      ))}
    </div>
  );
}
```

### 2. Prompt Optimizer Panel
```tsx
export function PromptOptimizer({ prompt }: { prompt: string }) {
  const [optimized, setOptimized] = useState(prompt);
  const [loading, setLoading] = useState(false);
  const [improvements, setImprovements] = useState<string[]>([]);

  const handleOptimize = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/enhance/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          context: { projectName: 'My App', projectType: 'web' }
        })
      });
      const data = await res.json();
      setOptimized(data.data.optimizedPrompt);
      setImprovements(data.data.improvements);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Button onClick={handleOptimize} disabled={loading}>
        Optimize with AI
      </Button>
      {improvements.length > 0 && (
        <ImprovementsList items={improvements} />
      )}
    </div>
  );
}
```

### 3. Quality Score Display
```tsx
interface QualityScores {
  clarity: number;
  specificity: number;
  structure: number;
  contextCompleteness: number;
  biasReduction: number;
}

export function QualityScoreCard({ scores }: { scores: QualityScores }) {
  const average = Object.values(scores).reduce((a, b) => a + b, 0) / Object.values(scores).length;

  return (
    <div className="card p-4">
      <h3 className="font-semibold mb-4">Prompt Quality Score</h3>
      <div className="text-3xl font-bold mb-4">{Math.round(average)}/10</div>
      
      <div className="space-y-2">
        {Object.entries(scores).map(([key, value]) => (
          <ScoreItem key={key} label={key} value={value} max={10} />
        ))}
      </div>
    </div>
  );
}
```

### 4. Feedback Loop Component
```tsx
export function PromptFeedbackLoop({
  initialPrompt,
  onRefined
}: {
  initialPrompt: string;
  onRefined: (prompt: string) => void;
}) {
  const [currentPrompt, setCurrentPrompt] = useState(initialPrompt);
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRefinement = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/enhance/refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPrompt, feedback })
      });
      const data = await res.json();
      setCurrentPrompt(data.data.refinedPrompt);
      onRefined(data.data.refinedPrompt);
      setFeedback('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <TextArea
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        placeholder="Describe what you'd like to improve..."
      />
      <Button onClick={handleRefinement} disabled={loading || !feedback}>
        Refine Based on Feedback
      </Button>
    </div>
  );
}
```

## Integration Steps

1. **Update the builder component** to use `/api/enhance/advanced` for generation
2. **Add streaming indicator** for real-time feedback
3. **Create optimizer panel** in results view
4. **Add quality score display** in results
5. **Implement feedback loop** for iterative refinement
6. **Update results view** with new features

## Usage Examples

### Generate with Streaming
```typescript
async function generateWithStreaming(projectData) {
  const response = await fetch('/api/enhance/stream', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(projectData)
  });

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    
    const text = decoder.decode(value);
    const lines = text.split('\n');
    
    lines.forEach(line => {
      if (line.startsWith('event:')) {
        const event = line.substring(7);
        // Handle event
      }
      if (line.startsWith('data:')) {
        const data = JSON.parse(line.substring(6));
        // Handle data
      }
    });
  }
}
```

### Quick Optimization
```typescript
async function optimizePrompt(prompt: string) {
  const res = await fetch('/api/enhance/optimize', {
    method: 'POST',
    body: JSON.stringify({ prompt, context: {} })
  });
  return res.json();
}
```

