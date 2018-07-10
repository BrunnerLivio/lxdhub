import { DatabaseModule, DatabaseService } from '@lxdhub/db';
import { Test } from '@nestjs/testing';

import { TestUtils } from '../test/test.utils';
import { ImageAvailabilityRepository, ImageAvailabilityRepositoryProvider } from './image-availability.repository';

/**
 * Test cases for the ImageAvailabilityRepository
 */
describe('ImageAvailabilityRepository', () => {
    let imageAvailabilityRepository: ImageAvailabilityRepository;
    let testUtils: TestUtils;
    beforeEach(async (done) => {
        const module = await Test.createTestingModule({
            imports: [
                DatabaseModule.forRoot()
            ],
            providers: [
                DatabaseService,
                ImageAvailabilityRepositoryProvider,
                TestUtils
            ]
        }).compile();
        testUtils = module.get<TestUtils>(TestUtils);
        await testUtils.reloadFixtures();
        imageAvailabilityRepository = testUtils.databaseService.connection.getCustomRepository(ImageAvailabilityRepository);
        done();
    });

    afterEach(async done => {
        await testUtils.closeDbConnection();
        done();
    });

    describe('getImageByRemoteAndImage', async () => {
        it('should return all remotes', async done => {
            const data = await imageAvailabilityRepository.getImageByRemoteAndImage(1, 1);
            expect(data.available).toBe(true);
            done();
        });

    });
});
