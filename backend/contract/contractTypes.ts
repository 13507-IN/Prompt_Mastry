export const PROJECT_TYPES = ['web', 'mobile', 'desktop', 'api', 'hybrid'] as const;
export const COLOR_PALETTES = ['dark', 'light', 'vibrant', 'minimal', 'custom'] as const;
export const NAVBAR_POSITIONS = ['top', 'left', 'right', 'bottom'] as const;
export const FRAMEWORKS = ['react', 'vue', 'angular', 'svelte', 'none'] as const;
export const UI_LIBRARIES = ['tailwind', 'bootstrap', 'material', 'custom', 'none'] as const;
export const DB_PROVIDERS = ['postgresql', 'mongodb', 'mysql', 'firebase', 'dynamodb', 'none'] as const;
export const ORM_CHOICES = ['prisma', 'typeorm', 'sequelize', 'mongoose', 'none'] as const;
export const API_TYPES = ['rest', 'graphql', 'both', 'none'] as const;
export const RUNTIMES = ['nodejs', 'python', 'java', 'go', 'rust'] as const;
export const DEPLOYMENT_PLATFORMS = ['vercel', 'netlify', 'heroku', 'aws', 'docker', 'not-decided'] as const;
export const ADDITIONAL_FEATURES = ['payments', 'email', 'sms', 'notifications', 'analytics', 'seo', 'cdn', 'testing'] as const;
export const GENERATION_MODES = ['quick', 'balanced', 'strict-spec'] as const;

export type ProjectType = typeof PROJECT_TYPES[number];
export type ColorPalette = typeof COLOR_PALETTES[number];
export type NavbarPosition = typeof NAVBAR_POSITIONS[number];
export type Framework = typeof FRAMEWORKS[number];
export type UiLibrary = typeof UI_LIBRARIES[number];
export type DbProvider = typeof DB_PROVIDERS[number];
export type OrmChoice = typeof ORM_CHOICES[number];
export type ApiType = typeof API_TYPES[number];
export type Runtime = typeof RUNTIMES[number];
export type DeploymentPlatform = typeof DEPLOYMENT_PLATFORMS[number];
export type AdditionalFeature = typeof ADDITIONAL_FEATURES[number];
export type GenerationMode = typeof GENERATION_MODES[number];

export type FieldType = 'string' | 'boolean' | 'number' | 'enum' | 'array';

export interface FieldRule {
  type: FieldType;
  allowed?: readonly string[];
  min?: number;
  max?: number;
  maxLength?: number;
}

export interface QuestionOption {
  value: string | number | boolean;
  label: string;
}

export interface ShowWhen {
  field: keyof FormData | string;
  values?: PrimitiveOptionValue[];
}

export interface Question {
  id: keyof FormData | string;
  question: string;
  type: 'mcq' | 'text' | 'multi-select';
  required: boolean;
  options?: QuestionOption[];
  placeholder?: string;
  showWhen?: ShowWhen;
}

export interface RequiredByStep {
  basics: string[];
  frontend: string[];
  backend: string[];
  additional: string[];
}

export interface ContractMetadata {
  version: string;
  lastUpdated: string;
  requiredByStep: RequiredByStep;
  generationModes: readonly string[];
  allowedValues: Record<string, readonly string[]>;
  fieldRules: Record<string, FieldRule>;
}

export interface FormData {
  title?: string;
  projectType?: ProjectType;
  useAI?: boolean;
  projectName?: string;
  projectType_custom?: string;
  colorPalette?: ColorPalette;
  colorPalette_custom?: string;
  navbarPosition?: NavbarPosition;
  navbarPosition_custom?: string;
  pageCount?: number;
  pageCount_custom?: string;
  framework?: Framework;
  framework_custom?: string;
  uiLibrary?: UiLibrary;
  uiLibrary_custom?: string;
  dbProvider?: DbProvider;
  dbProvider_custom?: string;
  ormChoice?: OrmChoice;
  ormChoice_custom?: string;
  authRequired?: boolean;
  authRequired_custom?: string;
  apiType?: ApiType;
  apiType_custom?: string;
  runtime?: Runtime;
  runtime_custom?: string;
  deploymentPlatform?: DeploymentPlatform;
  deploymentPlatform_custom?: string;
  additionalFeatures?: AdditionalFeature[];
  additionalFeatures_custom?: string;
  generationMode?: GenerationMode;
  projectId?: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}

export interface ApiEnvelope<T = unknown> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: Record<string, unknown>;
}

export interface ValidationErrorDetail {
  field: string;
  message: string;
}

export type PrimitiveOptionValue = string | number | boolean;

export interface QuestionsApiResponse {
  questions: Record<string, Question[]>;
  contract: ContractMetadata;
}
