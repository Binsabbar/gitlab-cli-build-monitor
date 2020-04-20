#!/usr/bin/env node

const { commandParser } = require('./utils/arguments');

const { accessToken, projects, updateIntervals } = commandParser.argv;
console.log({ accessToken, projects, updateIntervals });
