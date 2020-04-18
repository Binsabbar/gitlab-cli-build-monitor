const requiredKeys = ['projects', 'gitlab_access_token', 'update_intervals'];
const keysTypes = {
  gitlab_access_token: {
    validate: (arg) => typeof arg === 'string',
    errMessage: 'gitlab_access_token must be string',
  },
  projects: {
    validate: (arg) => Array.isArray(arg),
    errMessage: 'projects must be array',
  },
  update_intervals: {
    validate: (args) => typeof args === 'number',
    errMessage: 'update_intervals must be number',
  },
};

const errorMessage = (message) => ({ error: message });

const containsElement = (arr, element) => arr.indexOf(element) > -1;

const checkMissingKeys = (keys) => {
  for (let i = 0; i < requiredKeys.length; i++) {
    const requiredKey = requiredKeys[i];
    if (!containsElement(keys, requiredKey)) return errorMessage(`${requiredKey} is missing`);
  }
};

const validateKeysTypes = (config) => {
  for (let i = 0; i < requiredKeys.length; i++) {
    const key = requiredKeys[i];
    const value = config[key];
    const validateFunc = keysTypes[key].validate;
    if (!validateFunc(value)) return errorMessage(keysTypes[key].errMessage);
  }
};

const validate = (config) => {
  const keys = Object.keys(config);

  const missingKeysCheck = checkMissingKeys(keys);
  if (missingKeysCheck) return missingKeysCheck;

  const validateRes = validateKeysTypes(config);
  if (validateRes) return validateRes;

  return config;
};

exports.validate = validate;
