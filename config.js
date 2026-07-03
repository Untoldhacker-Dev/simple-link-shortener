const fs = require('fs');

function loadConfig() {
  try {
    const configPath = `./config.db_.json`;
    if (!fs.existsSync(configPath)) return {};
    return JSON.parse(fs.readFileSync(configPath, 'utf8'));
  } catch (error) {
    return {};
  }
}

function getConfigValue(key, fallback = '') {
  const config = loadConfig();
  return config[key] ?? fallback;
}

module.exports = { loadConfig, getConfigValue };
