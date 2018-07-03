#!/usr/bin/env node
const { LXDHubAPI } = require('@lxdhub/api');
const { LXDHubWeb } = require('@lxdhub/web');
const { LXDHubDbSync } = require('@lxdhub/dbsync');
const fs = require('fs-extra');
const path = require('path');
const YAML = require('js-yaml');

// Default time (in minutes) when the interval task should be executed
const DEFAULT_SYNC_INTERVAL = 3;

const DEFAULT_LXD_CONFIG_PATH = './lxdhub.yml';

const ROOT = path.join(__dirname, '..');

const certPath = process.env.LXD_CERT || 'certificates/client.crt';
const keyPath = process.env.LXD_KEY || 'certificates/client.key';

const lxd = {
    cert: fs.readFileSync(path.join(ROOT, certPath)),
    key: fs.readFileSync(path.join(ROOT, keyPath))
};

const database = {
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
    username: process.env.POSTGRES_USER || 'lxdhub',
    password: process.env.POSTGRES_PASSWORD || 'lxdhub',
    database: process.env.POSTGRES_DATABASE || 'lxdhub',
};

const lxdConfigPath = process.env.LXDHUB_CONFIG || DEFAULT_LXD_CONFIG_PATH;
const lxdConifgAbsolutePath =
    path.isAbsolute(lxdConfigPath) ?
        lxdConfigPath :
        path.join(ROOT, lxdConfigPath);


// Sync Interval in minutes
const syncInterval = parseInt((process.env.SYNC_INTERVAL || DEFAULT_SYNC_INTERVAL)) * 1000 * 60;

const logLevel = process.env.LOG_LEVEL;

// Function, which will be run as interval
const intervalTask = () =>
    // Read the config file
    fs.readFile(lxdConifgAbsolutePath, 'utf8')
        // Convert from YAML to JSON
        .then(content => YAML.safeLoad(content))
        // Create the database sync instance
        .then(lxdhubConfig => new LXDHubDbSync({ lxd, database, logLevel, lxdhubConfig }))
        // Run the database sync script
        .then(dbSync => dbSync.run());


// Run task when starting
intervalTask();

// Register interval
setInterval(() => intervalTask(), syncInterval);

new LXDHubAPI({
    hostUrl: '0.0.0.0',
    port: 3000,
    logLevel,
    lxd,
    docUrl: '/api/v1/doc',
    database
}).run();

new LXDHubWeb({
    hostUrl: process.env.HOST_URL || '0.0.0.0',
    port: parseInt(process.env.PORT, 10) || 4200,
    logLevel,
    loggingUrl: 'http://localhost:3000/api/v1/log',
    apiUrl: process.env.API_URL || 'http://localhost:3000'
}).run();
