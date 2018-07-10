import { DatabaseModule, DatabaseService } from '@lxdhub/db';
import { Test } from '@nestjs/testing';

import { TestUtils } from '../test/test.utils';
import { RemoteRepository, RemoteRepositoryProvider } from './remote.repository';

/**
 * Test cases for the remote repository
 */
describe('RemoteRepository', () => {
    let remoteRepository: RemoteRepository;
    let testUtils: TestUtils;
    beforeEach(async (done) => {
        const module = await Test.createTestingModule({
            imports: [
                DatabaseModule.forRoot()
            ],
            providers: [
                DatabaseService,
                RemoteRepositoryProvider,
                TestUtils
            ]
        }).compile();
        testUtils = module.get<TestUtils>(TestUtils);
        await testUtils.reloadFixtures();
        remoteRepository = testUtils.databaseService.connection.getCustomRepository(RemoteRepository);
        done();
    });

    afterEach(async done => {
        await testUtils.closeDbConnection();
        done();
    });

    describe('findAll', () => {
        it('should return all remotes', async done => {
            const [data, total] = await remoteRepository.findAll();
            expect(total).toBe(2);
            expect(data.length).toEqual(2);
            expect(data[0].serverUrl).toEqual('https://images.efiks.ovh:8443');
            done();
        });

    });
});
