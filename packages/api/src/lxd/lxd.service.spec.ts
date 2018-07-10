import { Image, Remote } from '@lxdhub/db';
import { Test } from '@nestjs/testing';

import { LXDHubAPISettings } from '..';
import { SourceImageFactory } from './factories';
import { LXDService } from './lxd.service';

class SourceImageFactoryMock {
    entityToDto() { }

}

class RequestMock {
    async post() { }
    async get() { }
}

const keyBuffer = new Buffer('key');
const certBuffer = new Buffer('cert');

const settings: LXDHubAPISettings = {
    lxd: {
        key: keyBuffer,
        cert: certBuffer
    },
    database: {
        database: '',
        host: '',
        password: '',
        port: 3000,
        username: ''
    }
} as LXDHubAPISettings;

/**
 * Test cases for the remote service
 */
describe('LXDService', () => {
    let lxdService: LXDService;
    let sourceImageFactory: SourceImageFactory;
    let request: RequestMock;

    beforeEach(async done => {
        // Mock Remote Module
        const module = await Test.createTestingModule({
            providers: [
                {
                    provide: 'LXDHubAPISettings',
                    useFactory: () => settings
                },
                LXDService,
                {
                    provide: 'SourceImageFactory',
                    useClass: SourceImageFactoryMock
                },
                {
                    provide: 'Request',
                    useClass: RequestMock
                }
            ]
        }).compile();

        // Get the lxdService in the Testing Module Context
        lxdService = module.get<LXDService>(LXDService);
        sourceImageFactory = module.get<SourceImageFactory>(SourceImageFactory);
        request = module.get<RequestMock>('Request');
        done();
    });
    let image: Image;
    let remote1: Remote;
    let remote2: Remote;
    let sourceImageMock;
    beforeEach(() => {
        image = new Image();
        remote1 = new Remote();
        remote2 = new Remote();
        remote2.serverUrl = 'https://destination.com';
        sourceImageMock = {};
    });

    describe('cloneImage', () => {

        it('should correctly call the sourceimage factory ', async () => {
            jest.spyOn(sourceImageFactory, 'entityToDto').mockImplementation(() => sourceImageMock);
            jest.spyOn(request, 'post').mockImplementation((param) => ({ metadata: { id: '1' } }));
            jest.spyOn(request, 'get').mockImplementation((param) => { });

            await lxdService.cloneImage(image, remote1, remote2);
            expect(request.post).toHaveBeenCalledWith({
                url: 'https://destination.com/1.0/images',
                json: {},
                cert: certBuffer,
                key: keyBuffer,
                rejectUnauthorized: false
            });
            expect(sourceImageFactory.entityToDto).toHaveBeenCalledWith(image, remote1, remote2);
        });
    });

    describe('getCloneStatus', () => {

        it('should correctly create requests ', async () => {
            jest.spyOn(request, 'post').mockImplementation((param) => ({ metadata: { id: '/1' } }));
            jest.spyOn(request, 'get').mockImplementation((param) => { });

            await lxdService.getCloneStatus({ serverUrl: 'https://destination.com' } as Remote, '1');
            expect(request.get).toHaveBeenCalledWith({
                url: 'https://destination.com/1.0/operations/1/wait',
                cert: certBuffer,
                key: keyBuffer,
                rejectUnauthorized: false
            });
        });

    });
});
