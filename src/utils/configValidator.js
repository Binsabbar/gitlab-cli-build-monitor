const requiredKeys = ['projects', 'gitlab_access_token', 'update_intervals'];
const containsElement = (arr, element) => arr.indexOf(element) > -1;

const validate = (config) => {
  const keys = Object.keys(config);
  for (let i = 0; i < requiredKeys.length; i++) {
    const key = requiredKeys[i];
    if (!containsElement(keys, key)) {
      return { error: `${key} is missing` };
    }
  }
};

exports.validate = validate;
