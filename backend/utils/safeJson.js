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

module.exports = {
  safeJsonParse,
  safeJsonStringify,
};
