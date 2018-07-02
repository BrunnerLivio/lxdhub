#!/usr/bin/env node
const { LXDHubWeb } = require('../lib/server/index');

new LXDHubWeb({
    hostUrl: process.env.HOST_URL || '0.0.0.0',
    port: parseInt(process.env.PORT, 10) || 4200,
    logLevel: process.env.LOG_LEVEL || 'silly',
    loggingUrl: 'http://localhost:3000/api/v1/log',
    apiUrl: process.env.API_URL || 'http://localhost:3000'
}).run();
