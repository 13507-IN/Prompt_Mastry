const { tryParseJsonFields } = require('./safeJson');

const JSON_FIELDS = ['additionalFeatures', 'recommendations', 'uiPreferences'];
const JSON_FALLBACKS = {
  additionalFeatures: [],
  recommendations: [],
  uiPreferences: {},
};

function serializeProjectRecord(project) {
  if (!project) return project;

  return tryParseJsonFields(project, JSON_FIELDS, JSON_FALLBACKS);
}

function serializeProjectRecords(projects) {
  if (!Array.isArray(projects)) return [];
  return projects.map(serializeProjectRecord);
}

module.exports = {
  serializeProjectRecord,
  serializeProjectRecords,
};
