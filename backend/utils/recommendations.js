function priorityRank(priority) {
  if (priority === 'high') return 3;
  if (priority === 'medium') return 2;
  return 1;
}

function generateRecommendations(projectData) {
  const recommendations = [];
  const dedupe = new Set();

  const {
    projectType,
    useAI,
    authRequired,
    apiType,
    additionalFeatures,
  } = projectData;

  const selectedFeatures = new Set(Array.isArray(additionalFeatures) ? additionalFeatures : []);

  function addRecommendation(entry) {
    const key = `${entry.category}:${entry.title}`;
    if (dedupe.has(key)) return;
    dedupe.add(key);
    recommendations.push(entry);
  }

  if (projectType === 'web' || projectType === 'hybrid') {
    addRecommendation({
      category: 'Frontend',
      title: 'Schema-based form validation',
      description: 'Use Zod or a similar schema system to validate all questionnaire inputs consistently.',
      priority: 'high',
      reason: 'Prevents invalid payload drift between UI and backend.',
      tags: ['devex', 'testing'],
    });

    addRecommendation({
      category: 'Frontend',
      title: 'Improve loading and empty states',
      description: 'Add skeleton and empty states for question fetch, generation, and result display.',
      priority: 'medium',
      reason: 'Improves reliability perception during network latency.',
      tags: ['performance', 'devex'],
    });

    if (!selectedFeatures.has('analytics')) {
      addRecommendation({
        category: 'Frontend',
        title: 'Add lightweight product analytics',
        description: 'Track form completion, drop-off steps, and prompt copy actions.',
        priority: 'medium',
        reason: 'Shows where users abandon the flow and what improves conversion.',
        tags: ['performance', 'devex'],
      });
    }
  }

  if (projectType === 'api' || projectType === 'hybrid' || projectType === 'web') {
    addRecommendation({
      category: 'Backend',
      title: 'Centralized request validation',
      description: 'Validate and normalize all input payloads at route boundaries.',
      priority: 'high',
      reason: 'Reduces runtime errors and unexpected DB states.',
      tags: ['security', 'testing'],
    });

    addRecommendation({
      category: 'Backend',
      title: 'Structured request logging',
      description: 'Log request ID, path, status code, and latency in JSON format.',
      priority: 'high',
      reason: 'Faster troubleshooting and production observability.',
      tags: ['performance', 'devex'],
    });

    addRecommendation({
      category: 'Backend',
      title: 'Rate-limit generation endpoints',
      description: 'Apply IP-based limits specifically for prompt generation endpoints.',
      priority: 'high',
      reason: 'Protects expensive generation flows from abuse.',
      tags: ['security', 'performance'],
    });

    if (authRequired) {
      addRecommendation({
        category: 'Backend',
        title: 'Authentication test coverage',
        description: 'Add route tests for auth-required behavior and invalid credentials.',
        priority: 'high',
        reason: 'Authentication regressions are high impact and security-critical.',
        tags: ['security', 'testing'],
      });
    }

    if (apiType === 'rest' || apiType === 'both') {
      addRecommendation({
        category: 'Backend',
        title: 'Publish OpenAPI spec',
        description: 'Generate OpenAPI docs for project and generation endpoints.',
        priority: 'medium',
        reason: 'Makes integration and maintenance simpler for future automation.',
        tags: ['devex'],
      });
    }
  }

  if (useAI) {
    addRecommendation({
      category: 'AI Features',
      title: 'Prompt quality mode presets',
      description: 'Support quick, balanced, and strict-spec generation modes.',
      priority: 'high',
      reason: 'Lets users trade speed vs specification depth intentionally.',
      tags: ['devex'],
    });

    addRecommendation({
      category: 'AI Features',
      title: 'Deterministic recommendation merging',
      description: 'Ensure selected recommendations are appended in stable order.',
      priority: 'medium',
      reason: 'Improves reproducibility for team reviews and prompt reruns.',
      tags: ['testing', 'devex'],
    });
  }

  addRecommendation({
    category: 'General',
    title: 'Add CI quality gates',
    description: 'Run lint, backend tests, and frontend E2E tests on each pull request.',
    priority: 'high',
    reason: 'Prevents regressions before shipping.',
    tags: ['testing', 'devex'],
  });

  addRecommendation({
    category: 'General',
    title: 'Document environment templates',
    description: 'Provide `.env.example` files for frontend and backend with required values.',
    priority: 'high',
    reason: 'Makes setup predictable and reduces onboarding friction.',
    tags: ['devex'],
  });

  const cappedByCategory = {};
  const MAX_PER_CATEGORY = 6;

  return recommendations
    .sort((a, b) => priorityRank(b.priority) - priorityRank(a.priority))
    .filter((item) => {
      const count = cappedByCategory[item.category] || 0;
      if (count >= MAX_PER_CATEGORY) return false;
      cappedByCategory[item.category] = count + 1;
      return true;
    });
}

module.exports = { generateRecommendations };
