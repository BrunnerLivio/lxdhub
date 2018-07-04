import { APIDto } from './api.dto';
import { Controller, Get, HttpCode, Inject, Req } from '@nestjs/common';
import { ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';

import { LXDHubAPISettings } from '.';

@Controller('')
/**
 * The root api controller
 */
export class AppController {
    constructor(
        @Inject('Fs')
        private Fs,
        @Inject('Path')
        private Path,
        @Inject('LXDHubAPISettings')
        private appSettings: LXDHubAPISettings
    ) { }

    /**
     * Reads the package.json file and returns the parsed object
     */
    private async getPackageJson() {
        const packageJsonPath = this.Path.join(__dirname, '../package.json');
        // @ts-ignore
        const packageJson = await this.Fs.readFile(packageJsonPath, 'utf8');
        return JSON.parse(packageJson);
    }

    /**
     * Generates the docurl using the express request object
     * and the given relative doc url
     * @param req The express request
     */
    private getDocsUrl(req: Request): string | null {
        if (this.appSettings.docUrl) {
            return `${req.protocol}://${req.get('host')}${this.appSettings.docUrl}`;
        } else {
            return null;
        }
    }

    /**
     * Returns general informations about the API.
     * @param req The express request object
     */
    @ApiOperation({ title: 'API Info' })
    @ApiResponse({ status: 200, type: APIDto })
    @Get('/')
    async apiInfo(@Req() req: Request): Promise<APIDto> {
        let packageJson;
        try {
            packageJson = await this.getPackageJson();
        }
        catch (ex) {
            throw HttpCode(500);
        }

        return {
            api_version: '1.0',
            package_version: packageJson.version,
            name: packageJson.name,
            description: packageJson.description,
            _links: {
                homepage: packageJson.homepage,
                bug_report: packageJson.bugs && packageJson.bugs.url || null,
                repository: packageJson.repository && packageJson.repository.url || null,
                docs: this.getDocsUrl(req),
            }
        };
    }
}
