#!/usr/bin/env node

const { commandParser } = require('./utils/arguments');

const { gitlab_access_token, projects, update_intervals } = commandParser.argv;
console.log({ gitlab_access_token, projects, update_intervals });
