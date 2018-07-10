import { Test } from '@nestjs/testing';

import { RemoteService } from '.';
import { RemoteFactory } from './factories';
import { RemoteRepository } from './remote.repository';

/**
 * Test cases for the remote service
 */
describe('RemoteService', () => {
    let remoteService: RemoteService;
    let remoteRepository: RemoteRepository;
    let remoteFactory: RemoteFactory;

    beforeEach(async done => {
        // Mock Remote Module
        const module = await Test.createTestingModule({
            providers: [
                RemoteService,
                RemoteRepository,
                RemoteFactory,
            ]
        }).compile();

        // Get the remoteService in the Testing Module Context
        remoteService = module.get<RemoteService>(RemoteService);
        remoteFactory = module.get<RemoteFactory>(RemoteFactory);
        remoteRepository = module.get<RemoteRepository>(RemoteRepository);
        done();
    });

    describe('findAll', () => {
        /**
         * Shoul return a list of remote dtos
         */
        it('should return RemoteDtos', async () => {
            const results = [{
                name: 'images',
                serverUrl: 'https://images.efiks.ovh:8443'
            }];

            jest.spyOn(remoteRepository, 'findAll').mockImplementation(() => [results, results.length]);
            jest.spyOn(remoteFactory, 'entitiesToDto').mockImplementation(() => results);

            expect(await remoteService.findAll()).toEqual({
                results,
            });
        });
    });
});
