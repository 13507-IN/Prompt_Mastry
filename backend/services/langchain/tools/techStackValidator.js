const { tool } = require('@langchain/core/tools');
const { z } = require('zod');

// Knowledge base of tech stack compatibility
const TECH_COMPATIBILITY = {
  frameworks: {
    'React': { compatible: ['Next.js', 'Vite', 'Remix'], ui: ['Tailwind', 'Material-UI', 'Chakra'] },
    'Vue': { compatible: ['Nuxt', 'Vite'], ui: ['Tailwind', 'Quasar', 'Vuetify'] },
    'Angular': { compatible: ['RxJS'], ui: ['Material Design', 'NGX Bootstrap'] },
    'Next.js': { compatible: ['React', 'Prisma', 'MongoDB', 'PostgreSQL'], ui: ['Tailwind'] },
    'Nuxt': { compatible: ['Vue', 'Prisma', 'MongoDB'], ui: ['Tailwind'] },
  },
  orms: {
    'Prisma': { databases: ['PostgreSQL', 'MySQL', 'SQLite', 'MongoDB'] },
    'TypeORM': { databases: ['PostgreSQL', 'MySQL', 'SQLite', 'MongoDB'] },
    'Sequelize': { databases: ['PostgreSQL', 'MySQL', 'SQLite'] },
    'Drizzle': { databases: ['PostgreSQL', 'MySQL', 'SQLite'] },
  },
  deployments: {
    'Vercel': { frameworks: ['Next.js', 'React', 'Vue'] },
    'Netlify': { frameworks: ['React', 'Vue', 'Angular'] },
    'AWS': { frameworks: ['Node.js', 'Python', 'Java'] },
    'Docker': { frameworks: ['Any'] },
  },
};

/**
 * Validate tech stack compatibility
 */
const validateTechStackTool = tool(
  async (input) => {
    const { framework, orm, database, deploymentPlatform } = input;
    const issues = [];
    const warnings = [];
    const recommendations = [];

    // Check ORM-Database compatibility
    if (orm && database) {
      const ormConfig = TECH_COMPATIBILITY.orms[orm];
      if (ormConfig && !ormConfig.databases.includes(database)) {
        issues.push(
          `${orm} is not officially supported with ${database}. Consider using: ${ormConfig.databases.join(', ')}`
        );
      }
    }

    // Check Framework compatibility
    if (framework) {
      const frameConfig = TECH_COMPATIBILITY.frameworks[framework];
      if (frameConfig && orm && !frameConfig.compatible.includes(orm)) {
        warnings.push(`${orm} with ${framework} requires additional configuration`);
      }
    }

    // Check Deployment compatibility
    if (deploymentPlatform && framework) {
      const deployConfig = TECH_COMPATIBILITY.deployments[deploymentPlatform];
      if (deployConfig && !deployConfig.frameworks.includes(framework) && deployConfig.frameworks[0] !== 'Any') {
        issues.push(
          `${framework} may require custom configuration for ${deploymentPlatform}`
        );
      }
    }

    // Add recommendations
    if (!issues.length && orm) {
      recommendations.push(`✓ Your ${orm} + ${database} combination is well-supported`);
    }

    return {
      isCompatible: issues.length === 0,
      issues,
      warnings,
      recommendations,
    };
  },
  {
    name: 'validate_tech_stack',
    description: 'Validate compatibility between tech stack choices',
    schema: z.object({
      framework: z.string().optional().describe('Frontend framework (e.g., React, Vue, Angular)'),
      orm: z.string().optional().describe('ORM choice (e.g., Prisma, TypeORM)'),
      database: z.string().optional().describe('Database (e.g., PostgreSQL, MongoDB)'),
      deploymentPlatform: z.string().optional().describe('Deployment platform (e.g., Vercel, AWS)'),
    }),
  }
);

/**
 * Suggest best practices for a tech stack
 */
const suggestBestPracticesTool = tool(
  async (input) => {
    const { framework, orm, database, hasAuth } = input;
    const practices = [];

    if (framework === 'Next.js') {
      practices.push('Use App Router for modern React patterns');
      practices.push('Implement API routes for backend logic');
      practices.push('Use middleware for authentication');
    }

    if (orm === 'Prisma') {
      practices.push('Use Prisma schema as single source of truth');
      practices.push('Enable Prisma Client validation');
      practices.push('Use migrations for database changes');
    }

    if (database === 'PostgreSQL') {
      practices.push('Enable full-text search capabilities');
      practices.push('Use indexes for performance');
      practices.push('Implement connection pooling');
    }

    if (hasAuth) {
      practices.push('Use secure JWT token storage');
      practices.push('Implement refresh token rotation');
      practices.push('Add rate limiting for auth endpoints');
    }

    return {
      framework: framework || 'Not specified',
      orm: orm || 'Not specified',
      database: database || 'Not specified',
      bestPractices: practices,
    };
  },
  {
    name: 'suggest_best_practices',
    description: 'Suggest best practices for the selected tech stack',
    schema: z.object({
      framework: z.string().optional(),
      orm: z.string().optional(),
      database: z.string().optional(),
      hasAuth: z.boolean().optional(),
    }),
  }
);

/**
 * Get alternative tech suggestions
 */
const getAlternativesTool = tool(
  async (input) => {
    const { category, current } = input;
    const alternatives = {
      framework: {
        'React': ['Vue', 'Angular', 'Svelte'],
        'Next.js': ['Remix', 'Gatsby', 'Nuxt (Vue)'],
        'Vue': ['React', 'Angular', 'Svelte'],
      },
      orm: {
        'Prisma': ['TypeORM', 'Sequelize', 'Drizzle'],
        'TypeORM': ['Prisma', 'Sequelize', 'Drizzle'],
      },
      database: {
        'PostgreSQL': ['MySQL', 'MongoDB', 'SQLite'],
        'MongoDB': ['PostgreSQL', 'MySQL', 'Firebase'],
      },
    };

    const options = alternatives[category]?.[current] || [];
    const pros = {
      Prisma: 'Type-safe, excellent DX, modern',
      TypeORM: 'Very flexible, supports many databases',
      'Next.js': 'Full-stack React, built-in optimization',
      'Vue': 'Lightweight, easy learning curve',
      PostgreSQL: 'Powerful, reliable, scalable',
    };

    return {
      category,
      current,
      alternatives: options.map((alt) => ({
        name: alt,
        pros: pros[alt] || 'Solid alternative',
      })),
    };
  },
  {
    name: 'get_alternatives',
    description: 'Get alternative options for a tech choice',
    schema: z.object({
      category: z.enum(['framework', 'orm', 'database']),
      current: z.string(),
    }),
  }
);

module.exports = {
  validateTechStackTool,
  suggestBestPracticesTool,
  getAlternativesTool,
};
