const PROJECT_TYPES = ['web', 'mobile', 'desktop', 'api', 'hybrid'];
const COLOR_PALETTES = ['dark', 'light', 'vibrant', 'minimal', 'custom'];
const NAVBAR_POSITIONS = ['top', 'left', 'right', 'bottom'];
const FRAMEWORKS = ['react', 'vue', 'angular', 'svelte', 'none'];
const UI_LIBRARIES = ['tailwind', 'bootstrap', 'material', 'custom', 'none'];
const DB_PROVIDERS = ['postgresql', 'mongodb', 'mysql', 'firebase', 'dynamodb', 'none'];
const ORM_CHOICES = ['prisma', 'typeorm', 'sequelize', 'mongoose', 'none'];
const API_TYPES = ['rest', 'graphql', 'both', 'none'];
const RUNTIMES = ['nodejs', 'python', 'java', 'go', 'rust'];
const DEPLOYMENT_PLATFORMS = ['vercel', 'netlify', 'heroku', 'aws', 'docker', 'not-decided'];
const ADDITIONAL_FEATURES = ['payments', 'email', 'sms', 'notifications', 'analytics', 'seo', 'cdn', 'testing'];
const GENERATION_MODES = ['quick', 'balanced', 'strict-spec'];

const REQUIRED_BY_STEP = {
  basics: ['projectType', 'useAI', 'projectName'],
  frontend: ['colorPalette', 'navbarPosition', 'pageCount', 'framework', 'uiLibrary'],
  backend: ['dbProvider', 'ormChoice', 'authRequired', 'apiType', 'runtime'],
  additional: ['deploymentPlatform'],
};

const FIELD_RULES = {
  title: { type: 'string', maxLength: 160 },
  projectType: { type: 'enum', allowed: PROJECT_TYPES },
  useAI: { type: 'boolean' },
  projectName: { type: 'string', maxLength: 160 },
  projectType_custom: { type: 'string', maxLength: 500 },
  colorPalette: { type: 'enum', allowed: COLOR_PALETTES },
  colorPalette_custom: { type: 'string', maxLength: 500 },
  navbarPosition: { type: 'enum', allowed: NAVBAR_POSITIONS },
  navbarPosition_custom: { type: 'string', maxLength: 500 },
  pageCount: { type: 'number', min: 1, max: 1000 },
  pageCount_custom: { type: 'string', maxLength: 500 },
  framework: { type: 'enum', allowed: FRAMEWORKS },
  framework_custom: { type: 'string', maxLength: 500 },
  uiLibrary: { type: 'enum', allowed: UI_LIBRARIES },
  uiLibrary_custom: { type: 'string', maxLength: 500 },
  dbProvider: { type: 'enum', allowed: DB_PROVIDERS },
  dbProvider_custom: { type: 'string', maxLength: 500 },
  ormChoice: { type: 'enum', allowed: ORM_CHOICES },
  ormChoice_custom: { type: 'string', maxLength: 500 },
  authRequired: { type: 'boolean' },
  authRequired_custom: { type: 'string', maxLength: 500 },
  apiType: { type: 'enum', allowed: API_TYPES },
  apiType_custom: { type: 'string', maxLength: 500 },
  runtime: { type: 'enum', allowed: RUNTIMES },
  runtime_custom: { type: 'string', maxLength: 500 },
  deploymentPlatform: { type: 'enum', allowed: DEPLOYMENT_PLATFORMS },
  deploymentPlatform_custom: { type: 'string', maxLength: 500 },
  additionalFeatures: { type: 'array', allowed: ADDITIONAL_FEATURES },
  additionalFeatures_custom: { type: 'string', maxLength: 1000 },
  generationMode: { type: 'enum', allowed: GENERATION_MODES },
  projectId: { type: 'string', maxLength: 128 },
};

const QUESTIONS = {
  basics: [
    {
      id: 'projectType',
      question: 'What type of project are you building?',
      type: 'mcq',
      required: true,
      options: [
        { value: 'web', label: 'Web Application' },
        { value: 'mobile', label: 'Mobile App' },
        { value: 'desktop', label: 'Desktop App' },
        { value: 'api', label: 'API/Backend Service' },
        { value: 'hybrid', label: 'Multiple Platforms' },
      ],
    },
    {
      id: 'projectType_custom',
      question: 'Add any additional details about your project type',
      type: 'text',
      required: false,
      showWhen: { field: 'projectType' },
      placeholder: 'E.g., It will be a real-time collaborative tool.',
    },
    {
      id: 'useAI',
      question: 'Will AI be used in this project?',
      type: 'mcq',
      required: true,
      options: [
        { value: true, label: 'Yes' },
        { value: false, label: 'No' },
      ],
    },
    {
      id: 'projectName',
      question: 'What is the name of your project?',
      type: 'text',
      required: true,
      placeholder: 'Enter project name',
    },
  ],
  frontend: [
    {
      id: 'colorPalette',
      question: 'What color palette do you prefer?',
      type: 'mcq',
      required: true,
      options: [
        { value: 'dark', label: 'Dark Mode' },
        { value: 'light', label: 'Light Mode' },
        { value: 'vibrant', label: 'Vibrant Colors' },
        { value: 'minimal', label: 'Minimal/Clean' },
        { value: 'custom', label: 'Custom' },
      ],
    },
    {
      id: 'colorPalette_custom',
      question: 'Describe your color scheme in detail (optional)',
      type: 'text',
      required: false,
      showWhen: { field: 'colorPalette', values: ['custom'] },
      placeholder: 'E.g., Primary: #3B82F6, Secondary: #1F2937, Accent: #FBBF24',
    },
    {
      id: 'navbarPosition',
      question: 'Where should the navbar be positioned?',
      type: 'mcq',
      required: true,
      options: [
        { value: 'top', label: 'Top' },
        { value: 'left', label: 'Left Sidebar' },
        { value: 'right', label: 'Right Sidebar' },
        { value: 'bottom', label: 'Bottom' },
      ],
    },
    {
      id: 'navbarPosition_custom',
      question: 'Any specific navbar requirements? (optional)',
      type: 'text',
      required: false,
      showWhen: { field: 'navbarPosition' },
      placeholder: 'E.g., Sticky header, dropdown menus, search bar.',
    },
    {
      id: 'pageCount',
      question: 'How many pages will your application have?',
      type: 'mcq',
      required: true,
      options: [
        { value: 1, label: 'Single Page (SPA)' },
        { value: 3, label: '3-5 Pages' },
        { value: 10, label: '6-10 Pages' },
        { value: 20, label: '10+ Pages' },
      ],
    },
    {
      id: 'pageCount_custom',
      question: 'List the main pages/sections (optional)',
      type: 'text',
      required: false,
      showWhen: { field: 'pageCount' },
      placeholder: 'E.g., Home, About, Products, Dashboard, Settings',
    },
    {
      id: 'framework',
      question: 'What frontend framework do you want to use?',
      type: 'mcq',
      required: true,
      options: [
        { value: 'react', label: 'React/Next.js' },
        { value: 'vue', label: 'Vue.js' },
        { value: 'angular', label: 'Angular' },
        { value: 'svelte', label: 'Svelte' },
        { value: 'none', label: 'No Framework (Vanilla)' },
      ],
    },
    {
      id: 'framework_custom',
      question: 'Any framework preferences? (optional)',
      type: 'text',
      required: false,
      showWhen: { field: 'framework' },
      placeholder: 'E.g., Need SSR, specific version, or alternative framework',
    },
    {
      id: 'uiLibrary',
      question: 'Do you need a UI component library?',
      type: 'mcq',
      required: true,
      options: [
        { value: 'tailwind', label: 'Tailwind CSS' },
        { value: 'bootstrap', label: 'Bootstrap' },
        { value: 'material', label: 'Material UI' },
        { value: 'custom', label: 'Custom CSS' },
        { value: 'none', label: 'No Library' },
      ],
    },
    {
      id: 'uiLibrary_custom',
      question: 'Any UI/UX specifications? (optional)',
      type: 'text',
      required: false,
      showWhen: { field: 'uiLibrary', values: ['custom'] },
      placeholder: 'E.g., Animations, dark mode toggle, accessibility requirements',
    },
  ],
  backend: [
    {
      id: 'dbProvider',
      question: 'Which database provider do you want to use?',
      type: 'mcq',
      required: true,
      options: [
        { value: 'postgresql', label: 'PostgreSQL' },
        { value: 'mongodb', label: 'MongoDB' },
        { value: 'mysql', label: 'MySQL' },
        { value: 'firebase', label: 'Firebase' },
        { value: 'dynamodb', label: 'DynamoDB' },
        { value: 'none', label: 'Not decided yet' },
      ],
    },
    {
      id: 'dbProvider_custom',
      question: 'Any database specifications? (optional)',
      type: 'text',
      required: false,
      showWhen: { field: 'dbProvider' },
      placeholder: 'E.g., Need sharding, replication, specific version',
    },
    {
      id: 'ormChoice',
      question: 'Which ORM/ODM would you like to use?',
      type: 'mcq',
      required: true,
      options: [
        { value: 'prisma', label: 'Prisma' },
        { value: 'typeorm', label: 'TypeORM' },
        { value: 'sequelize', label: 'Sequelize' },
        { value: 'mongoose', label: 'Mongoose' },
        { value: 'none', label: 'No ORM' },
      ],
    },
    {
      id: 'ormChoice_custom',
      question: 'Any ORM preferences? (optional)',
      type: 'text',
      required: false,
      showWhen: { field: 'ormChoice' },
      placeholder: 'E.g., Need migrations, specific query builder features',
    },
    {
      id: 'authRequired',
      question: 'Does your application need authentication?',
      type: 'mcq',
      required: true,
      options: [
        { value: true, label: 'Yes' },
        { value: false, label: 'No' },
      ],
    },
    {
      id: 'authRequired_custom',
      question: 'Authentication details (optional)',
      type: 'text',
      required: false,
      showWhen: { field: 'authRequired', values: [true] },
      placeholder: 'E.g., JWT, OAuth2, Social login (Google, GitHub), MFA',
    },
    {
      id: 'apiType',
      question: 'What type of API do you want to build?',
      type: 'mcq',
      required: true,
      options: [
        { value: 'rest', label: 'REST API' },
        { value: 'graphql', label: 'GraphQL' },
        { value: 'both', label: 'Both REST & GraphQL' },
        { value: 'none', label: 'No API' },
      ],
    },
    {
      id: 'apiType_custom',
      question: 'API specifications (optional)',
      type: 'text',
      required: false,
      showWhen: { field: 'apiType' },
      placeholder: 'E.g., Versioning, rate limiting, webhook support',
    },
    {
      id: 'runtime',
      question: 'What backend runtime do you prefer?',
      type: 'mcq',
      required: true,
      options: [
        { value: 'nodejs', label: 'Node.js' },
        { value: 'python', label: 'Python' },
        { value: 'java', label: 'Java' },
        { value: 'go', label: 'Go' },
        { value: 'rust', label: 'Rust' },
      ],
    },
    {
      id: 'runtime_custom',
      question: 'Any runtime preferences? (optional)',
      type: 'text',
      required: false,
      showWhen: { field: 'runtime' },
      placeholder: 'E.g., Specific version, framework (Express, FastAPI, Spring)',
    },
  ],
  additional: [
    {
      id: 'deploymentPlatform',
      question: 'Where do you plan to deploy your app?',
      type: 'mcq',
      required: true,
      options: [
        { value: 'vercel', label: 'Vercel' },
        { value: 'netlify', label: 'Netlify' },
        { value: 'heroku', label: 'Heroku' },
        { value: 'aws', label: 'AWS' },
        { value: 'docker', label: 'Docker' },
        { value: 'not-decided', label: 'Not decided yet' },
      ],
    },
    {
      id: 'deploymentPlatform_custom',
      question: 'Deployment details (optional)',
      type: 'text',
      required: false,
      showWhen: { field: 'deploymentPlatform' },
      placeholder: 'E.g., CI/CD pipeline, scaling requirements, staging setup',
    },
    {
      id: 'additionalFeatures',
      question: 'Any additional features you need? (Select all that apply)',
      type: 'multi-select',
      required: false,
      options: [
        { value: 'payments', label: 'Payment Integration (Stripe, PayPal)' },
        { value: 'email', label: 'Email Service' },
        { value: 'sms', label: 'SMS Service' },
        { value: 'notifications', label: 'Real-time Notifications' },
        { value: 'analytics', label: 'Analytics' },
        { value: 'seo', label: 'SEO Optimization' },
        { value: 'cdn', label: 'CDN for Media' },
        { value: 'testing', label: 'Testing Framework' },
      ],
    },
    {
      id: 'additionalFeatures_custom',
      question: 'Any other features or requirements? (optional)',
      type: 'text',
      required: false,
      showWhen: { field: 'additionalFeatures' },
      placeholder: 'E.g., File uploads, caching, search functionality.',
    },
  ],
};

function normalizeString(value) {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function normalizeBoolean(value) {
  if (typeof value === 'boolean') return value;
  if (value === 'true') return true;
  if (value === 'false') return false;
  return undefined;
}

function normalizeNumber(value) {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim().length > 0) {
    const parsed = Number.parseInt(value, 10);
    if (Number.isFinite(parsed)) return parsed;
  }
  return undefined;
}

function normalizeArray(value) {
  if (Array.isArray(value)) {
    return value
      .map((item) => normalizeString(String(item)))
      .filter(Boolean);
  }
  return undefined;
}

function normalizeProjectInput(input = {}) {
  return {
    title: normalizeString(input.title),
    projectId: normalizeString(input.projectId),
    projectType: normalizeString(input.projectType),
    useAI: normalizeBoolean(input.useAI),
    projectName: normalizeString(input.projectName),
    projectType_custom: normalizeString(input.projectType_custom),
    colorPalette: normalizeString(input.colorPalette),
    colorPalette_custom: normalizeString(input.colorPalette_custom),
    navbarPosition: normalizeString(input.navbarPosition),
    navbarPosition_custom: normalizeString(input.navbarPosition_custom),
    pageCount: normalizeNumber(input.pageCount),
    pageCount_custom: normalizeString(input.pageCount_custom),
    framework: normalizeString(input.framework),
    framework_custom: normalizeString(input.framework_custom),
    uiLibrary: normalizeString(input.uiLibrary),
    uiLibrary_custom: normalizeString(input.uiLibrary_custom),
    dbProvider: normalizeString(input.dbProvider),
    dbProvider_custom: normalizeString(input.dbProvider_custom),
    ormChoice: normalizeString(input.ormChoice),
    ormChoice_custom: normalizeString(input.ormChoice_custom),
    authRequired: normalizeBoolean(input.authRequired),
    authRequired_custom: normalizeString(input.authRequired_custom),
    apiType: normalizeString(input.apiType),
    apiType_custom: normalizeString(input.apiType_custom),
    runtime: normalizeString(input.runtime),
    runtime_custom: normalizeString(input.runtime_custom),
    deploymentPlatform: normalizeString(input.deploymentPlatform),
    deploymentPlatform_custom: normalizeString(input.deploymentPlatform_custom),
    additionalFeatures: normalizeArray(input.additionalFeatures) || [],
    additionalFeatures_custom: normalizeString(input.additionalFeatures_custom),
    generationMode: normalizeString(input.generationMode) || 'balanced',
  };
}

function buildGenerateRequiredFields(projectType) {
  const required = [...REQUIRED_BY_STEP.basics, ...REQUIRED_BY_STEP.additional];
  if (projectType === 'web' || projectType === 'hybrid') {
    required.push(...REQUIRED_BY_STEP.frontend);
  }
  if (projectType === 'api' || projectType === 'hybrid' || projectType === 'web') {
    required.push(...REQUIRED_BY_STEP.backend);
  }
  return [...new Set(required)];
}

function validateField(field, value) {
  const rule = FIELD_RULES[field];
  if (!rule) return null;

  if (value === undefined) return null;

  if (rule.type === 'string') {
    if (typeof value !== 'string') return `${field} must be a string`;
    if (rule.maxLength && value.length > rule.maxLength) {
      return `${field} must be ${rule.maxLength} characters or less`;
    }
    return null;
  }

  if (rule.type === 'boolean') {
    if (typeof value !== 'boolean') return `${field} must be a boolean`;
    return null;
  }

  if (rule.type === 'number') {
    if (typeof value !== 'number' || !Number.isFinite(value)) return `${field} must be a number`;
    if (rule.min !== undefined && value < rule.min) return `${field} must be at least ${rule.min}`;
    if (rule.max !== undefined && value > rule.max) return `${field} must be at most ${rule.max}`;
    return null;
  }

  if (rule.type === 'enum') {
    if (!rule.allowed.includes(value)) {
      return `${field} must be one of: ${rule.allowed.join(', ')}`;
    }
    return null;
  }

  if (rule.type === 'array') {
    if (!Array.isArray(value)) return `${field} must be an array`;
    const invalidValues = value.filter((item) => !rule.allowed.includes(item));
    if (invalidValues.length > 0) {
      return `${field} contains unsupported values: ${invalidValues.join(', ')}`;
    }
    return null;
  }

  return null;
}

function validateProjectInput(normalizedInput, requiredFields = []) {
  const errors = [];

  requiredFields.forEach((field) => {
    const value = normalizedInput[field];
    if (value === undefined || value === null || value === '') {
      errors.push({ field, message: `${field} is required` });
    }
  });

  Object.entries(normalizedInput).forEach(([field, value]) => {
    const issue = validateField(field, value);
    if (issue) {
      errors.push({ field, message: issue });
    }
  });

  if (Array.isArray(normalizedInput.additionalFeatures)) {
    normalizedInput.additionalFeatures = [...new Set(normalizedInput.additionalFeatures)];
  }

  return errors;
}

function validateCreateProjectPayload(payload) {
  const normalized = normalizeProjectInput(payload);
  const requiredFields = REQUIRED_BY_STEP.basics;
  const errors = validateProjectInput(normalized, requiredFields);

  const data = {
    title: normalized.title || normalized.projectName || 'New Project',
    projectType: normalized.projectType,
    useAI: normalized.useAI,
    projectName: normalized.projectName,
  };

  return {
    isValid: errors.length === 0,
    errors,
    data,
  };
}

function validateGeneratePayload(payload, { requireProjectId = false } = {}) {
  const normalized = normalizeProjectInput(payload);
  const requiredFields = buildGenerateRequiredFields(normalized.projectType);
  const errors = validateProjectInput(normalized, requiredFields);

  if (requireProjectId && !normalizeString(payload.projectId)) {
    errors.push({ field: 'projectId', message: 'projectId is required' });
  }

  return {
    isValid: errors.length === 0,
    errors,
    data: {
      ...normalized,
      projectId: normalizeString(payload.projectId),
    },
  };
}

function getContractMetadata() {
  return {
    version: '1.0.0',
    requiredByStep: REQUIRED_BY_STEP,
    generationModes: GENERATION_MODES,
    allowedValues: {
      projectType: PROJECT_TYPES,
      colorPalette: COLOR_PALETTES,
      navbarPosition: NAVBAR_POSITIONS,
      framework: FRAMEWORKS,
      uiLibrary: UI_LIBRARIES,
      dbProvider: DB_PROVIDERS,
      ormChoice: ORM_CHOICES,
      apiType: API_TYPES,
      runtime: RUNTIMES,
      deploymentPlatform: DEPLOYMENT_PLATFORMS,
      additionalFeatures: ADDITIONAL_FEATURES,
    },
  };
}

module.exports = {
  QUESTIONS,
  REQUIRED_BY_STEP,
  GENERATION_MODES,
  normalizeProjectInput,
  validateCreateProjectPayload,
  validateGeneratePayload,
  getContractMetadata,
};
