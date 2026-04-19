const express = require('express');
const router = express.Router();

// GET all questions for the questionnaire
router.get('/', (req, res) => {
  const questions = {
    basics: [
      {
        id: 'projectType',
        question: 'What type of project are you building?',
        type: 'mcq',
        options: [
          { value: 'web', label: 'Web Application' },
          { value: 'mobile', label: 'Mobile App' },
          { value: 'desktop', label: 'Desktop App' },
          { value: 'api', label: 'API/Backend Service' },
          { value: 'hybrid', label: 'Multiple Platforms' }
        ],
        customInput: true,
        customPlaceholder: 'Describe your project type in detail...'
      },
      {
        id: 'projectType_custom',
        question: 'Add any additional details about your project type',
        type: 'text',
        placeholder: 'E.g., It will be a real-time collaborative tool, etc.'
      },
      {
        id: 'useAI',
        question: 'Will AI be used in this project?',
        type: 'mcq',
        options: [
          { value: true, label: 'Yes' },
          { value: false, label: 'No' }
        ]
      },
      {
        id: 'projectName',
        question: 'What is the name of your project?',
        type: 'text',
        placeholder: 'Enter project name'
      }
    ],
    frontend: [
      {
        id: 'colorPalette',
        question: 'What color palette do you prefer?',
        type: 'mcq',
        options: [
          { value: 'dark', label: 'Dark Mode' },
          { value: 'light', label: 'Light Mode' },
          { value: 'vibrant', label: 'Vibrant Colors' },
          { value: 'minimal', label: 'Minimal/Clean' },
          { value: 'custom', label: 'Custom' }
        ]
      },
      {
        id: 'colorPalette_custom',
        question: 'Describe your color scheme in detail (optional)',
        type: 'text',
        placeholder: 'E.g., Primary: #3B82F6, Secondary: #1F2937, Accent: #FBBF24'
      },
      {
        id: 'navbarPosition',
        question: 'Where should the navbar be positioned?',
        type: 'mcq',
        options: [
          { value: 'top', label: 'Top' },
          { value: 'left', label: 'Left Sidebar' },
          { value: 'right', label: 'Right Sidebar' },
          { value: 'bottom', label: 'Bottom' }
        ]
      },
      {
        id: 'navbarPosition_custom',
        question: 'Any specific navbar requirements? (optional)',
        type: 'text',
        placeholder: 'E.g., Sticky header, dropdown menus, search bar, etc.'
      },
      {
        id: 'pageCount',
        question: 'How many pages will your application have?',
        type: 'mcq',
        options: [
          { value: 1, label: 'Single Page (SPA)' },
          { value: 3, label: '3-5 Pages' },
          { value: 10, label: '6-10 Pages' },
          { value: 20, label: '10+ Pages' }
        ]
      },
      {
        id: 'pageCount_custom',
        question: 'List the main pages/sections (optional)',
        type: 'text',
        placeholder: 'E.g., Home, About, Products, Dashboard, Settings'
      },
      {
        id: 'framework',
        question: 'What frontend framework do you want to use?',
        type: 'mcq',
        options: [
          { value: 'react', label: 'React/Next.js' },
          { value: 'vue', label: 'Vue.js' },
          { value: 'angular', label: 'Angular' },
          { value: 'svelte', label: 'Svelte' },
          { value: 'none', label: 'No Framework (Vanilla)' }
        ]
      },
      {
        id: 'framework_custom',
        question: 'Any framework preferences? (optional)',
        type: 'text',
        placeholder: 'E.g., Need SSR, specific version, or alternative framework'
      },
      {
        id: 'uiLibrary',
        question: 'Do you need a UI component library?',
        type: 'mcq',
        options: [
          { value: 'tailwind', label: 'Tailwind CSS' },
          { value: 'bootstrap', label: 'Bootstrap' },
          { value: 'material', label: 'Material UI' },
          { value: 'custom', label: 'Custom CSS' },
          { value: 'none', label: 'No Library' }
        ]
      },
      {
        id: 'uiLibrary_custom',
        question: 'Any UI/UX specifications? (optional)',
        type: 'text',
        placeholder: 'E.g., Animations, dark mode toggle, accessibility requirements'
      }
    ],
    backend: [
      {
        id: 'dbProvider',
        question: 'Which database provider do you want to use?',
        type: 'mcq',
        options: [
          { value: 'postgresql', label: 'PostgreSQL' },
          { value: 'mongodb', label: 'MongoDB' },
          { value: 'mysql', label: 'MySQL' },
          { value: 'firebase', label: 'Firebase' },
          { value: 'dynamodb', label: 'DynamoDB' },
          { value: 'none', label: 'Not decided yet' }
        ]
      },
      {
        id: 'dbProvider_custom',
        question: 'Any database specifications? (optional)',
        type: 'text',
        placeholder: 'E.g., Need sharding, replication, specific version'
      },
      {
        id: 'ormChoice',
        question: 'Which ORM/ODM would you like to use?',
        type: 'mcq',
        options: [
          { value: 'prisma', label: 'Prisma' },
          { value: 'typeorm', label: 'TypeORM' },
          { value: 'sequelize', label: 'Sequelize' },
          { value: 'mongoose', label: 'Mongoose' },
          { value: 'none', label: 'No ORM' }
        ]
      },
      {
        id: 'ormChoice_custom',
        question: 'Any ORM preferences? (optional)',
        type: 'text',
        placeholder: 'E.g., Need migrations, specific query builder features'
      },
      {
        id: 'authRequired',
        question: 'Does your application need authentication?',
        type: 'mcq',
        options: [
          { value: true, label: 'Yes' },
          { value: false, label: 'No' }
        ]
      },
      {
        id: 'authRequired_custom',
        question: 'Authentication details (optional)',
        type: 'text',
        placeholder: 'E.g., JWT, OAuth2, Social login (Google, GitHub), MFA'
      },
      {
        id: 'apiType',
        question: 'What type of API do you want to build?',
        type: 'mcq',
        options: [
          { value: 'rest', label: 'REST API' },
          { value: 'graphql', label: 'GraphQL' },
          { value: 'both', label: 'Both REST & GraphQL' },
          { value: 'none', label: 'No API' }
        ]
      },
      {
        id: 'apiType_custom',
        question: 'API specifications (optional)',
        type: 'text',
        placeholder: 'E.g., Versioning, rate limiting, webhook support'
      },
      {
        id: 'runtime',
        question: 'What backend runtime do you prefer?',
        type: 'mcq',
        options: [
          { value: 'nodejs', label: 'Node.js' },
          { value: 'python', label: 'Python' },
          { value: 'java', label: 'Java' },
          { value: 'go', label: 'Go' },
          { value: 'rust', label: 'Rust' }
        ]
      },
      {
        id: 'runtime_custom',
        question: 'Any runtime preferences? (optional)',
        type: 'text',
        placeholder: 'E.g., Specific version, framework (Express, FastAPI, Spring)'
      }
    ],
    additional: [
      {
        id: 'deploymentPlatform',
        question: 'Where do you plan to deploy your app?',
        type: 'mcq',
        options: [
          { value: 'vercel', label: 'Vercel' },
          { value: 'netlify', label: 'Netlify' },
          { value: 'heroku', label: 'Heroku' },
          { value: 'aws', label: 'AWS' },
          { value: 'docker', label: 'Docker' },
          { value: 'not-decided', label: 'Not decided yet' }
        ]
      },
      {
        id: 'deploymentPlatform_custom',
        question: 'Deployment details (optional)',
        type: 'text',
        placeholder: 'E.g., CI/CD pipeline, environment setup, scaling requirements'
      },
      {
        id: 'additionalFeatures',
        question: 'Any additional features you need? (Select all that apply)',
        type: 'multi-select',
        options: [
          { value: 'payments', label: 'Payment Integration (Stripe, PayPal)' },
          { value: 'email', label: 'Email Service' },
          { value: 'sms', label: 'SMS Service' },
          { value: 'notifications', label: 'Real-time Notifications' },
          { value: 'analytics', label: 'Analytics' },
          { value: 'seo', label: 'SEO Optimization' },
          { value: 'cdn', label: 'CDN for Media' },
          { value: 'testing', label: 'Testing Framework' }
        ]
      },
      {
        id: 'additionalFeatures_custom',
        question: 'Any other features or requirements? (optional)',
        type: 'text',
        placeholder: 'E.g., File uploads, caching, search functionality, etc.'
      }
    ]
  };

  res.json(questions);
});

module.exports = router;
