function safeJsonParse(value, fallback) {
  if (typeof value !== 'string' || value.trim().length === 0) {
    return fallback;
  }

  try {
    return JSON.parse(value);
  } catch (_error) {
    return fallback;
  }
}

function safeJsonStringify(value, fallback = '[]') {
  try {
    return JSON.stringify(value);
  } catch (_error) {
    return fallback;
  }
}

function tryParseJsonFields(obj, fields, fallbacks) {
  if (!obj || typeof obj !== 'object') return obj;
  const result = { ...obj };
  (fields || []).forEach((field) => {
    const fallback = fallbacks && fallbacks[field] !== undefined ? fallbacks[field] : null;
    result[field] = safeJsonParse(result[field], fallback);
  });
  return result;
}

module.exports = {
  safeJsonParse,
  safeJsonStringify,
  tryParseJsonFields,
};
