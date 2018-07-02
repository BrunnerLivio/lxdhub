// These are important and needed before anything else
import 'reflect-metadata';
import 'zone.js/dist/zone-node';

import { Interfaces, LogType, WinstonLogger } from '@lxdhub/common';
import * as Chalk from 'chalk';
import * as express from 'express';
import { join } from 'path';

import { LXDHubWebSettings } from './lxdhubwebsettings.interface';

export class LXDHubWeb implements Interfaces.ILXDHubService {
    private app;
    private logger: WinstonLogger;
    private distFolder: string = join(process.cwd(), 'lib');
    private browserDistFolder: string = join(this.distFolder, 'browser');
    constructor(private settings: LXDHubWebSettings) {
        this.logger = new WinstonLogger('LXDHubWeb', settings.logLevel as LogType);
    }

    private setupNgRendering() {
        this.app.use(express.static(this.browserDistFolder));
        this.app.get('/config.json', (_, res) => res.json(this.settings));
        this.app.get('*', (_, res) => res.sendFile(join(this.browserDistFolder, 'index.html')));
    }

    private async bootstrap() {
        this.app = express();
        this.setupNgRendering();
    }

    private async listen() {
        this.app.listen(this.settings.port, this.settings.hostUrl, () =>
            this.logger.log(`Running webinterface on ` + Chalk.default.blue(`http://${this.settings.hostUrl}:${this.settings.port}`)));
        try {
            this.logger.log(`Set configuration: ${Chalk.default.blue(JSON.stringify(this.settings))}`);
        } catch (ex) { }
    }

    /**
     * Runs the webinterface with the set settings
     */
    async run() {
        try {
            await this.bootstrap();
        } catch (err) {
            err = err as Error;
            this.logger.error(`An error occured while bootstraping the application`);
            this.logger.error(err.message);
        }
        return await this.listen();
    }
}
