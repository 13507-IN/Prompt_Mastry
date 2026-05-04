const { safeJsonParse } = require('./safeJson');

function serializeProjectRecord(project) {
  if (!project) return project;

  return {
    ...project,
    additionalFeatures: safeJsonParse(project.additionalFeatures, []),
    recommendations: safeJsonParse(project.recommendations, []),
    uiPreferences: safeJsonParse(project.uiPreferences, {}),
  };
}

function serializeProjectRecords(projects) {
  if (!Array.isArray(projects)) return [];
  return projects.map(serializeProjectRecord);
}

module.exports = {
  serializeProjectRecord,
  serializeProjectRecords,
};
