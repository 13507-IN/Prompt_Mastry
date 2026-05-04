const assert = require('node:assert/strict');
const { generatePrompt } = require('../utils/promptGenerator');
const { generateRecommendations } = require('../utils/recommendations');

function createPrismaMock(overrides = {}) {
  return {
    $queryRaw: async () => [{ ok: 1 }],
    $disconnect: async () => {},
    project: {
      count: async () => 0,
      findMany: async () => [],
      findUnique: async () => null,
      create: async () => ({
        id: 'proj_1',
        title: 'Demo',
        projectType: 'web',
        useAI: true,
        projectName: 'Demo',
      }),
      update: async () => ({
        id: 'proj_1',
        title: 'Demo',
      }),
      delete: async () => ({}),
      ...(overrides.project || {}),
    },
    ...(overrides || {}),
  };
}

function withMockedApp(prismaMock) {
  process.env.NODE_ENV = 'production';

  const prismaPath = require.resolve('../prismaClient');
  const serverPath = require.resolve('../server');
  const projectsPath = require.resolve('../routes/projects');
  const generatePath = require.resolve('../routes/generate');
  const questionsPath = require.resolve('../routes/questions');

  const originalPrismaModule = require.cache[prismaPath];
  const originalServerModule = require.cache[serverPath];
  const originalProjectsModule = require.cache[projectsPath];
  const originalGenerateModule = require.cache[generatePath];
  const originalQuestionsModule = require.cache[questionsPath];

  require.cache[prismaPath] = {
    id: prismaPath,
    filename: prismaPath,
    loaded: true,
    exports: { prisma: prismaMock },
  };

  delete require.cache[serverPath];
  delete require.cache[projectsPath];
  delete require.cache[generatePath];
  delete require.cache[questionsPath];

  const app = require('../server');

  function restore() {
    if (originalPrismaModule) require.cache[prismaPath] = originalPrismaModule;
    else delete require.cache[prismaPath];

    if (originalServerModule) require.cache[serverPath] = originalServerModule;
    else delete require.cache[serverPath];

    if (originalProjectsModule) require.cache[projectsPath] = originalProjectsModule;
    else delete require.cache[projectsPath];

    if (originalGenerateModule) require.cache[generatePath] = originalGenerateModule;
    else delete require.cache[generatePath];

    if (originalQuestionsModule) require.cache[questionsPath] = originalQuestionsModule;
    else delete require.cache[questionsPath];
  }

  return { app, restore };
}

async function withServer(app, fn) {
  const server = await new Promise((resolve) => {
    const instance = app.listen(0, '127.0.0.1', () => resolve(instance));
  });

  const address = server.address();
  const baseUrl = `http://127.0.0.1:${address.port}`;

  try {
    await fn(baseUrl);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}

async function runCase(name, fn) {
  try {
    await fn();
    console.log(`PASS ${name}`);
  } catch (error) {
    console.error(`FAIL ${name}`);
    console.error(error);
    process.exitCode = 1;
  }
}

const baseData = {
  projectType: 'web',
  useAI: true,
  projectName: 'Prompt Mastery',
  colorPalette: 'dark',
  navbarPosition: 'top',
  pageCount: 3,
  framework: 'react',
  uiLibrary: 'tailwind',
  dbProvider: 'postgresql',
  ormChoice: 'prisma',
  authRequired: false,
  apiType: 'rest',
  runtime: 'nodejs',
  deploymentPlatform: 'vercel',
  additionalFeatures: ['testing'],
};

async function main() {
  await runCase('prompt mode guidance', async () => {
    const quick = generatePrompt({ ...baseData, generationMode: 'quick' });
    const strict = generatePrompt({ ...baseData, generationMode: 'strict-spec' });

    assert.match(quick, /concise implementation plan/i);
    assert.match(strict, /detailed technical specification/i);
  });

  await runCase('recommendations are tagged and deduplicated', async () => {
    const recommendations = generateRecommendations(baseData);
    const keys = recommendations.map((item) => `${item.category}:${item.title}`);
    const uniqueKeys = new Set(keys);

    assert.equal(keys.length, uniqueKeys.size);
    assert.ok(recommendations.some((item) => Array.isArray(item.tags) && item.tags.length > 0));
  });

  await runCase('invalid create payload returns validation error', async () => {
    const { app, restore } = withMockedApp(createPrismaMock());
    try {
      await withServer(app, async (baseUrl) => {
        const response = await fetch(`${baseUrl}/api/projects`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ projectType: 'invalid-type' }),
        });

        assert.equal(response.status, 400);
        const payload = await response.json();
        assert.equal(payload.success, false);
        assert.equal(payload.error.code, 'VALIDATION_ERROR');
      });
    } finally {
      restore();
    }
  });

  await runCase('generate/save falls back to preview_only when db fails', async () => {
    const prismaMock = createPrismaMock({
      project: {
        update: async () => {
          throw new Error('database unavailable');
        },
      },
    });

    const { app, restore } = withMockedApp(prismaMock);
    try {
      await withServer(app, async (baseUrl) => {
        const response = await fetch(`${baseUrl}/api/generate/save`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            projectId: 'proj_1',
            ...baseData,
            generationMode: 'balanced',
          }),
        });

        assert.equal(response.status, 200);
        const payload = await response.json();
        assert.equal(payload.success, true);
        assert.equal(payload.data.status, 'preview_only');
      });
    } finally {
      restore();
    }
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
