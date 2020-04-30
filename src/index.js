#!/usr/bin/env node
/* eslint-disable no-console */

const { commandParser } = require('./utils/arguments');

const { accessToken, projects, updateIntervals } = commandParser.argv;
console.log({ accessToken, projects, updateIntervals });
