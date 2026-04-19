// Recommendations Engine - Suggests improvements based on project data

function generateRecommendations(projectData) {
  const recommendations = [];

  const { projectType, useAI, authRequired, apiType, dbProvider, additionalFeatures, runtime, framework, authRequired_custom } = projectData;

  // Frontend recommendations
  if (projectType === 'web' || projectType === 'hybrid') {
    recommendations.push({
      category: 'Frontend',
      title: 'Add TypeScript Support',
      description: 'Use TypeScript for type safety and better developer experience',
      priority: 'high',
      reason: 'Prevents runtime errors and improves code maintainability'
    });

    recommendations.push({
      category: 'Frontend',
      title: 'Implement State Management',
      description: 'Use Redux, Zustand, Jotai, or Context API for complex state management',
      priority: 'medium',
      reason: 'Easier to manage complex application state as it grows'
    });

    recommendations.push({
      category: 'Frontend',
      title: 'Add Form Validation',
      description: 'Use React Hook Form, Formik, or Zod for robust form handling',
      priority: 'high',
      reason: 'Prevents invalid data submission and improves user experience'
    });

    recommendations.push({
      category: 'Frontend',
      title: 'Setup ESLint & Prettier',
      description: 'Configure ESLint for code quality and Prettier for code formatting',
      priority: 'high',
      reason: 'Maintains consistent code style across the team'
    });

    if (!additionalFeatures?.includes('analytics')) {
      recommendations.push({
        category: 'Frontend',
        title: 'Add Analytics Tracking',
        description: 'Integrate Google Analytics, Mixpanel, or Amplitude',
        priority: 'medium',
        reason: 'Track user behavior and improve UX based on data insights'
      });
    }

    if (!additionalFeatures?.includes('seo')) {
      recommendations.push({
        category: 'Frontend',
        title: 'Optimize for SEO',
        description: 'Add meta tags, sitemap, structured data, and Open Graph',
        priority: 'medium',
        reason: 'Improves search engine rankings and social media sharing'
      });
    }

    recommendations.push({
      category: 'Frontend',
      title: 'Add Responsive Image Optimization',
      description: 'Use next/image or similar for lazy loading and responsive images',
      priority: 'high',
      reason: 'Improves page load time and reduces bandwidth usage'
    });

    recommendations.push({
      category: 'Frontend',
      title: 'Implement Progressive Web App (PWA)',
      description: 'Add service workers, manifest file, and offline capabilities',
      priority: 'medium',
      reason: 'Enables installation on home screen and offline usage'
    });
  }

  // Backend recommendations
  if (projectType === 'api' || projectType === 'hybrid' || projectType === 'web') {
    recommendations.push({
      category: 'Backend',
      title: 'Setup Comprehensive Logging',
      description: 'Use Winston, Pino, or Morgan for structured logging',
      priority: 'high',
      reason: 'Essential for debugging and monitoring in production'
    });

    recommendations.push({
      category: 'Backend',
      title: 'Add Error Tracking',
      description: 'Integrate Sentry, Rollbar, or Datadog for error monitoring',
      priority: 'high',
      reason: 'Catch and monitor production errors in real-time'
    });

    recommendations.push({
      category: 'Backend',
      title: 'Implement Rate Limiting',
      description: 'Use express-rate-limit or similar to prevent API abuse',
      priority: 'high',
      reason: 'Protects your API from DDoS attacks and brute force attempts'
    });

    recommendations.push({
      category: 'Backend',
      title: 'Add Input Validation & Sanitization',
      description: 'Use Joi, Yup, or Zod for schema validation',
      priority: 'high',
      reason: 'Prevents invalid data and SQL injection attacks'
    });

    if (authRequired_custom || authRequired) {
      recommendations.push({
        category: 'Backend',
        title: 'Implement Secure Authentication',
        description: 'Use bcrypt for password hashing and JWT for tokens',
        priority: 'high',
        reason: 'Ensures secure user authentication and data protection'
      });

      recommendations.push({
        category: 'Backend',
        title: 'Add Authentication Testing',
        description: 'Include unit and integration tests for auth flows',
        priority: 'high',
        reason: 'Security-critical feature that needs thorough testing'
      });
    }

    if (apiType === 'rest' || apiType === 'both') {
      recommendations.push({
        category: 'Backend',
        title: 'Generate API Documentation',
        description: 'Use Swagger/OpenAPI or similar for API docs',
        priority: 'medium',
        reason: 'Makes API easier to integrate and maintain'
      });

      recommendations.push({
        category: 'Backend',
        title: 'Implement API Versioning',
        description: 'Use URL versioning (v1, v2) or header-based versioning',
        priority: 'medium',
        reason: 'Allows backward compatibility when making breaking changes'
      });
    }

    if (!additionalFeatures?.includes('testing')) {
      recommendations.push({
        category: 'Backend',
        title: 'Setup Testing Framework',
        description: 'Use Jest, Mocha, or Vitest for unit/integration tests',
        priority: 'high',
        reason: 'Ensures code reliability and prevents regressions'
      });

      recommendations.push({
        category: 'Backend',
        title: 'Add Code Coverage',
        description: 'Aim for 80%+ code coverage with CI integration',
        priority: 'medium',
        reason: 'Maintains code quality and identifies untested code paths'
      });
    }

    recommendations.push({
      category: 'Backend',
      title: 'Implement Database Indexing',
      description: 'Optimize database queries with proper indexes',
      priority: 'high',
      reason: 'Significantly improves query performance'
    });

    recommendations.push({
      category: 'Backend',
      title: 'Add Caching Strategy',
      description: 'Use Redis or Memcached for frequently accessed data',
      priority: 'medium',
      reason: 'Reduces database load and improves response time'
    });

    if (!additionalFeatures?.includes('cd')) {
      recommendations.push({
        category: 'Backend',
        title: 'Setup CI/CD Pipeline',
        description: 'Use GitHub Actions, GitLab CI, or Jenkins',
        priority: 'medium',
        reason: 'Automates testing and deployment for reliability'
      });
    }
  }

  // AI Features
  if (useAI) {
    recommendations.push({
      category: 'AI Features',
      title: 'Select an AI Model Provider',
      description: 'Choose between OpenAI, Claude API, Gemini, or self-hosted models',
      priority: 'high',
      reason: 'Essential for implementing AI features'
    });

    recommendations.push({
      category: 'AI Features',
      title: 'Implement Prompt Engineering',
      description: 'Optimize prompts for better AI responses and consistency',
      priority: 'high',
      reason: 'Better prompts lead to better AI outputs'
    });

    recommendations.push({
      category: 'AI Features',
      title: 'Add Rate Limiting for AI Calls',
      description: 'Limit API calls based on user tier or usage',
      priority: 'medium',
      reason: 'AI API calls can be expensive; limiting prevents bill shock'
    });

    recommendations.push({
      category: 'AI Features',
      title: 'Implement Caching for AI Responses',
      description: 'Cache similar prompts to reduce API calls',
      priority: 'medium',
      reason: 'Reduces costs and improves response time'
    });

    recommendations.push({
      category: 'AI Features',
      title: 'Add AI Response Validation',
      description: 'Validate and sanitize AI-generated content',
      priority: 'high',
      reason: 'Prevents malicious or inappropriate content'
    });
  }

  // General recommendations
  recommendations.push({
    category: 'General',
    title: 'Setup Environment Variables',
    description: 'Use .env files and vault services for configuration',
    priority: 'high',
    reason: 'Keeps sensitive data secure and configuration flexible'
  });

  recommendations.push({
    category: 'General',
    title: 'Implement Security Headers',
    description: 'Add CORS, CSP, X-Frame-Options, and other security headers',
    priority: 'high',
    reason: 'Protects against common web vulnerabilities'
  });

  recommendations.push({
    category: 'General',
    title: 'Setup Database Backups',
    description: 'Implement automated backup strategy with point-in-time restore',
    priority: 'high',
    reason: 'Ensures data safety and quick recovery from disasters'
  });

  recommendations.push({
    category: 'General',
    title: 'Add Performance Monitoring',
    description: 'Use NewRelic, Datadog, or similar for APM',
    priority: 'medium',
    reason: 'Identifies performance bottlenecks in production'
  });

  recommendations.push({
    category: 'General',
    title: 'Setup Health Check Endpoints',
    description: 'Implement /health endpoint for monitoring',
    priority: 'medium',
    reason: 'Allows load balancers and monitoring tools to check service status'
  });

  recommendations.push({
    category: 'General',
    title: 'Implement Graceful Shutdown',
    description: 'Handle SIGTERM signals for safe server shutdown',
    priority: 'medium',
    reason: 'Prevents data loss during deployments'
  });

  recommendations.push({
    category: 'General',
    title: 'Add Docker Support',
    description: 'Create Dockerfile and docker-compose for containerization',
    priority: 'medium',
    reason: 'Ensures consistent environment across development and production'
  });

  return recommendations;
}

module.exports = { generateRecommendations };
