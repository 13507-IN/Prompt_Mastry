function modeGuidance(mode) {
  if (mode === 'quick') {
    return [
      'Provide a concise implementation plan.',
      'Prioritize fast delivery and pragmatic defaults.',
      'Keep explanations brief and actionable.',
    ];
  }

  if (mode === 'strict-spec') {
    return [
      'Produce a detailed technical specification before implementation.',
      'Define architecture, data contracts, error handling, and test coverage explicitly.',
      'Avoid assumptions; state tradeoffs and chosen defaults.',
    ];
  }

  return [
    'Provide a balanced level of implementation detail.',
    'Include practical architecture decisions and realistic milestones.',
    'Call out key risks and mitigations.',
  ];
}

function listItem(label, value) {
  if (!value && value !== false && value !== 0) return null;
  return `- **${label}:** ${value}`;
}

function formatAdditionalFeatures(features) {
  if (!Array.isArray(features) || features.length === 0) {
    return ['- None explicitly selected'];
  }
  return features.map((feature) => `- ${feature}`);
}

function generatePrompt(projectData) {
  const {
    projectName,
    projectType,
    projectType_custom,
    useAI,
    colorPalette,
    colorPalette_custom,
    navbarPosition,
    navbarPosition_custom,
    pageCount,
    pageCount_custom,
    framework,
    framework_custom,
    uiLibrary,
    uiLibrary_custom,
    dbProvider,
    dbProvider_custom,
    ormChoice,
    ormChoice_custom,
    authRequired,
    authRequired_custom,
    apiType,
    apiType_custom,
    runtime,
    runtime_custom,
    deploymentPlatform,
    deploymentPlatform_custom,
    additionalFeatures,
    additionalFeatures_custom,
    generationMode = 'balanced',
  } = projectData;

  const lines = [];
  lines.push('# Project Build Brief');
  lines.push('');
  lines.push(`## Project`);
  lines.push(`- **Name:** ${projectName || 'Untitled Project'}`);
  lines.push(`- **Type:** ${projectType || 'Not specified'}`);
  if (projectType_custom) lines.push(`- **Type Notes:** ${projectType_custom}`);
  lines.push(`- **AI Required:** ${useAI ? 'Yes' : 'No'}`);
  lines.push(`- **Prompt Mode:** ${generationMode}`);
  lines.push('');

  if (projectType === 'web' || projectType === 'hybrid') {
    lines.push('## Frontend Requirements');
    [
      listItem('Color Palette', colorPalette),
      listItem('Color Notes', colorPalette_custom),
      listItem('Navbar Position', navbarPosition),
      listItem('Navbar Notes', navbarPosition_custom),
      listItem('Page Count', pageCount),
      listItem('Page Notes', pageCount_custom),
      listItem('Framework', framework),
      listItem('Framework Notes', framework_custom),
      listItem('UI Library', uiLibrary),
      listItem('UI Notes', uiLibrary_custom),
    ]
      .filter(Boolean)
      .forEach((line) => lines.push(line));
    lines.push('');
  }

  if (projectType === 'api' || projectType === 'hybrid' || projectType === 'web') {
    lines.push('## Backend Requirements');
    [
      listItem('Runtime', runtime),
      listItem('Runtime Notes', runtime_custom),
      listItem('Database', dbProvider),
      listItem('Database Notes', dbProvider_custom),
      listItem('ORM/ODM', ormChoice),
      listItem('ORM Notes', ormChoice_custom),
      listItem('API Type', apiType),
      listItem('API Notes', apiType_custom),
      listItem('Authentication Required', authRequired ? 'Yes' : 'No'),
      listItem('Authentication Notes', authRequired_custom),
    ]
      .filter(Boolean)
      .forEach((line) => lines.push(line));
    lines.push('');
  }

  lines.push('## Delivery Context');
  lines.push(`- **Deployment Target:** ${deploymentPlatform || 'Not specified'}`);
  if (deploymentPlatform_custom) lines.push(`- **Deployment Notes:** ${deploymentPlatform_custom}`);
  lines.push('');

  lines.push('## Additional Features');
  formatAdditionalFeatures(additionalFeatures).forEach((line) => lines.push(line));
  if (additionalFeatures_custom) lines.push(`- ${additionalFeatures_custom}`);
  lines.push('');

  lines.push('## Instructions for the AI Assistant');
  lines.push('- Build the solution using the requirements above.');
  modeGuidance(generationMode).forEach((line) => lines.push(`- ${line}`));
  lines.push('- Return implementation steps, key code structure, and test plan.');
  lines.push('- Keep recommendations aligned with solo-developer maintainability.');
  lines.push('');

  lines.push('## Expected Output');
  lines.push('- Architecture summary');
  lines.push('- Core implementation checklist');
  lines.push('- Testing strategy');
  lines.push('- Deployment notes');
  lines.push('- Risks and mitigations');

  return lines.join('\n');
}

module.exports = { generatePrompt };
