import { Test } from '@nestjs/testing';
import { Request } from 'express';

import { AppController } from './app.controller';
import { FsMock, PathMock } from './third-party';

describe('AppController', () => {
    let appController: AppController;
    let fs: FsMock;
    let path: PathMock;
    const packageJsonData: object = {
        name: 'lxdhub-api',
        version: '1.1.4'
    };
    const apiSettings = {
        docUrl: '/api/v1/docs'
    };

    // The request mock
    const request: Request = {
        protocol: 'http',
        get(type: string) {
            return 'localhost:8080';
        }
    } as Request;

    beforeEach(async () => {
        // Mock module
        const module = await Test.createTestingModule({
            controllers: [
                AppController
            ],
            providers: [
                {
                    provide: 'Fs',
                    useClass: FsMock
                },
                {
                    provide: 'Path',
                    useClass: PathMock
                },
                {
                    provide: 'LXDHubAPISettings',
                    useFactory: () => apiSettings
                }
            ]
        }).compile();
        fs = module.get<FsMock>('Fs');
        path = module.get<PathMock>('Path');
        appController = module.get<AppController>(AppController);
    });

    describe('apiInfo', () => {
        const packageJsonPath = './package.json';
        beforeEach(() => {
            // Mock third party
            jest.spyOn(path, 'join')
                .mockImplementation((...paths: string[]) => packageJsonPath);
            jest.spyOn(fs, 'readFile')
                .mockImplementation(async (path_: string) => JSON.stringify(packageJsonData));
        });

        it('should read the correct file', async () => {
            await appController.apiInfo(request);
            expect(fs.readFile).toHaveBeenCalledWith(packageJsonPath, 'utf8');
            expect(fs.readFile).toHaveBeenCalledTimes(1);
        });

        it('should return the correct packageJsonData', async () => {
            const data = await appController.apiInfo(request);
            expect(data.api_version).toBe('1.0');
            expect(data.name).toBe('lxdhub-api');
            expect(data.package_version).toBe('1.1.4');
        });

        it('should return null when repository object is not set in packageJson', async () => {
            const data = await appController.apiInfo(request);
            expect(data._links.repository).toBe(null);
        });

        it('should return the repository url', async () => {
            const packageJsondata = {
                repository: {
                    url: 'https://repo.com'
                }
            };
            jest.spyOn(fs, 'readFile')
                .mockImplementation(async (path_: string) => JSON.stringify(packageJsondata));
            const data = await appController.apiInfo(request);

            expect(data._links.repository).toBe('https://repo.com');
        });

        it('should return the correct docs url', async () => {
            const data = await appController.apiInfo(request);
            expect(data._links.docs).toBe('http://localhost:8080/api/v1/docs');
        });

        it('should throw an error, if the package.json is not valid', async () => {
            jest.spyOn(fs, 'readFile')
                .mockImplementation(async (path_: string) => 'not valid data');
            // workaround for async error catching
            // https://github.com/facebook/jest/issues/1377
            try {
                await appController.apiInfo(request);
            }
            catch (err) {
                expect(() => { throw err; }).toThrowError();
            }
        });
    });
});
