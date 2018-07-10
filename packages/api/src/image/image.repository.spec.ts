import { DatabaseModule, DatabaseService } from '@lxdhub/db';
import { Test } from '@nestjs/testing';

import { TestUtils } from '../test/test.utils';
import { ImageRepository, ImageRepositoryProvider } from './image.repository';

/**
 * Test cases for the image repository
 */
describe('ImageRepository', () => {
    let imageRepository: ImageRepository;
    let testUtils: TestUtils;

    beforeEach(async done => {
        const module = await Test.createTestingModule({
            imports: [
                DatabaseModule.forRoot()
            ],
            providers: [
                DatabaseService,
                ImageRepositoryProvider,
                TestUtils
            ]
        }).compile();
        testUtils = module.get<TestUtils>(TestUtils);
        await testUtils.reloadFixtures();
        imageRepository = testUtils.databaseService.connection.getCustomRepository(ImageRepository);
        done();
    });

    afterEach(async done => {
        await testUtils.closeDbConnection();
        done();
    });

    describe('findAll', () => {
        /**
         * Check if limit works
         */
        it('should return 1 image with fingerprint 9aadf7ae171eb2e2b9b84320efd7576ee0f08f0b5cbfc78e3b81a836fc945141', async () => {
            const [data, total] = await imageRepository.findByRemote(1, { offset: 0, limit: 1 });
            expect(total).toBe(2);
            expect(data.length).toEqual(1);
            expect(data[0].fingerprint).toEqual('9aadf7ae171eb2e2b9b84320efd7576ee0f08f0b5cbfc78e3b81a836fc945141');
        });

        /**
         * Check if offset works
         */
        it('should return 1 image with fingerprint 6fce0e9befe843135fc6e5c00dd2ef7158feba80cf0eb022b097d967d318d47d', async () => {
            const [data, total] = await imageRepository.findByRemote(1, { offset: 1, limit: 1 });
            expect(total).toBe(2);
            expect(data.length).toEqual(1);
            expect(data[0].fingerprint).toEqual('6fce0e9befe843135fc6e5c00dd2ef7158feba80cf0eb022b097d967d318d47d');
        });

        /**
         * Check if limit works
         */
        it('should return 2 images', async () => {
            const [data, total] = await imageRepository.findByRemote(1, { offset: 0, limit: 2 });
            expect(total).toBe(2);
            expect(data.length).toEqual(2);
            expect(data[0].fingerprint).toEqual('9aadf7ae171eb2e2b9b84320efd7576ee0f08f0b5cbfc78e3b81a836fc945141');
            expect(data[1].fingerprint).toEqual('6fce0e9befe843135fc6e5c00dd2ef7158feba80cf0eb022b097d967d318d47d');
        });

        describe('search', () => {
            it('should search for distribution=ubuntu', async () => {
                const [data, total] = await imageRepository.findByRemote(1, { offset: 0, limit: 2 }, { distribution: 'ubuntu-core' });
                expect(total).toBe(1);
                expect(data.length).toEqual(1);
                expect(data[0].osArchitecture.operatingSystem.distribution).toEqual('ubuntu-core');
            });

            it('should search for humanName arch=amd64', async () => {
                const [data, total] = await imageRepository.findByRemote(1, { offset: 0, limit: 2 }, { arch: 'amd64' });
                expect(total).toBe(2);
                expect(data.length).toEqual(2);
                expect(data[0].osArchitecture.architecture.humanName).toEqual('amd64');
                expect(data[1].osArchitecture.architecture.humanName).toEqual('amd64');
            });

            it('should search for humanName arch=am', async () => {
                const [data, total] = await imageRepository.findByRemote(1, { offset: 0, limit: 2 }, { arch: 'am' });
                expect(total).toBe(2);
                expect(data.length).toEqual(2);
                expect(data[0].osArchitecture.architecture.humanName).toEqual('amd64');
                expect(data[1].osArchitecture.architecture.humanName).toEqual('amd64');
            });

            it('should search for processorName arch=86_32', async () => {
                const [data, total] = await imageRepository.findByRemote(1, { offset: 0, limit: 2 }, { arch: '86_32' });
                expect(total).toBe(2);
                expect(data.length).toEqual(2);
                expect(data[0].osArchitecture.architecture.processorName).toEqual('86_32');
                expect(data[1].osArchitecture.architecture.processorName).toEqual('86_32');
            });

            it('should search for desc=ubuntu xenial', async () => {
                const [data, total] = await imageRepository.findByRemote(1, { offset: 0, limit: 2 }, { desc: 'ubuntu xenial' });
                expect(total).toBe(1);
                expect(data.length).toEqual(1);
                expect(data[0].id).toEqual(1);
            });

            it('should search for fingerprint=6fce', async () => {
                const [data, total] = await imageRepository.findByRemote(1, { offset: 0, limit: 2 }, { fingerprint: '6fce' });
                expect(total).toBe(1);
                expect(data.length).toEqual(1);
                expect(data[0].fingerprint).toEqual('6fce0e9befe843135fc6e5c00dd2ef7158feba80cf0eb022b097d967d318d47d');
            });

            it('should search for version=16', async () => {
                const [data, total] = await imageRepository.findByRemote(1, { offset: 0, limit: 2 }, { version: '16' });
                expect(total).toBe(2);
                expect(data.length).toEqual(2);
                expect(data[0].osArchitecture.operatingSystem.version).toEqual('16.04');
            });

            it('should search for version=16 arch=amd64 distribution=ubuntu release=xenial fingerprint=9a', async () => {
                const [data, total] = await imageRepository.findByRemote(1, { offset: 0, limit: 2 }, {
                    version: '16',
                    arch: 'amd64',
                    distribution: 'ubuntu',
                    release: 'xenial',
                    fingerprint: '9a'
                });
                expect(total).toBe(1);
                expect(data.length).toEqual(1);
                expect(data[0].id).toEqual(1);
            });
        });
    });

    describe('findOneItem', () => {
        /**
         * Should return image with the correct id
         */
        it('should return the image with id 1', async () => {
            const image = await imageRepository.findOneItem(1);
            expect(image.fingerprint).toBe('9aadf7ae171eb2e2b9b84320efd7576ee0f08f0b5cbfc78e3b81a836fc945141');
            expect(image.id).toBe(1);
        });
    });
});
