import { Test } from '@nestjs/testing';
import { plainToClass } from 'class-transformer';

import { PaginationOptionsDto } from '../common';
import { ImageAvailabilityService } from '../image-availability/image-availability.service';
import { LXDService } from '../lxd/lxd.service';
import { RemoteRepository } from '../remote/remote.repository';
import { SearchDictionary, SearchService } from '../search';
import { ImageDetailFactory, ImageListItemFactory } from './factories';
import { ImageRepository } from './image.repository';
import { ImageService } from './image.service';

const searchDitionary: SearchDictionary[] = [
    {
        aliases: [
            ''
        ],
        searchLiteralKey: ''
    }
];

class SearchServiceMock {
    getLiteral(query: string, dictionaries: SearchDictionary[], key?: string) {
        return null;
    }
}

class RemoteRepositoryMock {
    findOneItem() { }
}

class LXDServiceMock {
    async cloneImage() { }
}

class ImageAvailabilityServiceMock {
    getOrCreate() { }
}

/**
 * Test cases for the image service
 */
describe('ImageService', () => {
    let imageService: ImageService;
    let imageListItemFactory: ImageListItemFactory;
    let imageRepository: ImageRepository;
    let remoteRepository: RemoteRepository;
    let imageDetailFactory: ImageDetailFactory;
    let lxdService: LXDService;
    let imageAvailabilityService: ImageAvailabilityService;

    beforeEach(async done => {
        // Mock Image Module
        const module = await Test.createTestingModule({
            providers: [
                ImageService,
                ImageRepository,
                ImageListItemFactory,
                ImageDetailFactory,
                {
                    provide: SearchService,
                    useClass: SearchServiceMock
                },
                {
                    provide: 'ImageSearchDictionary',
                    useFactory: () => searchDitionary
                },
                {
                    provide: 'RemoteRepository',
                    useClass: RemoteRepositoryMock
                },
                {
                    provide: 'LXDService',
                    useClass: LXDServiceMock
                },
                {
                    provide: 'ImageAvailabilityService',
                    useClass: ImageAvailabilityServiceMock
                }
            ]
        }).compile();

        // Get the imageService in the Testing Module Context
        imageListItemFactory = module.get<ImageListItemFactory>(ImageListItemFactory);
        imageDetailFactory = module.get<ImageDetailFactory>(ImageDetailFactory);
        imageRepository = module.get<ImageRepository>(ImageRepository);
        remoteRepository = module.get<RemoteRepository>(RemoteRepository);
        lxdService = module.get<LXDService>(LXDService);
        imageAvailabilityService = module.get<ImageAvailabilityService>(ImageAvailabilityService);
        imageService = module.get<ImageService>(ImageService);
        done();
    });

    describe('findByRemote', () => {
        it('should return ImageListItem', async () => {
            const results = [{
                fingerprint: 'fingerprint1',
                description: 'desc1',
                uploadedAt: new Date(),
                id: 1
            }, {
                fingerprint: 'fingerprint2',
                description: 'desc2',
                uploadedAt: new Date(),
                id: 2
            }];

            jest.spyOn(imageRepository, 'findByRemote').mockImplementation(() => [results, results.length]);
            jest.spyOn(imageListItemFactory, 'entitiesToDto').mockImplementation(() => results);

            // Convert to PagintaionOptionsDto
            // with using the class-validator validation
            const options = plainToClass(PaginationOptionsDto, { limit: 2, offset: 0 });
            expect(await imageService.findByRemote(1, options)).toEqual({
                results,
                offset: 0,
                limit: 2,
                total: results.length,
            });
        });

        it('should call ImageRepository correctly without search-query-string', async () => {
            jest.spyOn(imageRepository, 'findByRemote').mockImplementation(() => []);
            jest.spyOn(imageListItemFactory, 'entitiesToDto').mockImplementation(() => []);

            // Convert to PagintaionOptionsDto
            // with using the class-validator validation
            const options = plainToClass(PaginationOptionsDto, { limit: 2, offset: 0 });
            await imageService.findByRemote(1, options);
            expect(imageRepository.findByRemote).toHaveBeenCalledWith(1, options, {});
        });
    });

    describe('findOne', () => {
        /**
         * Image service should return one image and
         * wrap it in a Result
         */
        it('should return image detail', async () => {
            const result = {
                fingerprint: 'fingerprint1'
            };

            const imageRepositoryMock = jest.spyOn(imageRepository, 'findOneItem').mockImplementation(() => result);
            const imageDetailFactoryMock = jest.spyOn(imageDetailFactory, 'entityToDto').mockImplementation(() => result);

            expect(await imageService.findOne(1)).toEqual({ results: result });
            // Expect mock to be called once each
            expect(imageDetailFactoryMock.mock.calls.length).toBe(1);
            expect(imageRepositoryMock.mock.calls.length).toBe(1);
        });

        /**
         * When no image was found, throw an error
         */
        it('should throw an exception if no image is found', async () => {
            jest.spyOn(imageRepository, 'findOneItem')
                .mockImplementation(() => undefined);

            // workaround for async error catching
            // https://github.com/facebook/jest/issues/1377
            try {
                await imageService.findOne(-1);
            }
            catch (err) {
                expect(() => { throw err; }).toThrowError();
            }
        });

    });

    describe('cloneImage', () => {
        beforeEach(() => {
            jest.spyOn(lxdService, 'cloneImage').mockImplementation(() => null);
            jest.spyOn(remoteRepository, 'findOneItem').mockImplementation(id => ({ id }));
            jest.spyOn(imageRepository, 'findOneItem').mockImplementation(() => ({ id: 1 }));
            jest.spyOn(imageAvailabilityService, 'getOrCreate').mockImplementation(() => ({ id: 1 }));
            jest.spyOn(imageService, 'findOne').mockImplementation(() => ({ id: 1 }));
        });

        it('should call lxcservice correctly', async () => {
            await imageService.cloneImage(1, { sourceRemoteId: 2, destinationRemoteId: 3 });
            expect(lxdService.cloneImage).toHaveBeenCalledWith({ id: 1 }, { id: 2 }, { id: 3 });
        });

        it('should throw an error, when no image is found', async () => {
            jest.spyOn(imageRepository, 'findOneItem').mockImplementation(() => null);
            imageService.cloneImage(1, { sourceRemoteId: 2, destinationRemoteId: 3 })
                .catch(err => expect(err).toBeDefined());
        });

        it('should throw an error, when no sourceremote is found', async () => {
            jest.spyOn(remoteRepository, 'findOneItem').mockImplementation(() => null);
            imageService.cloneImage(1, { sourceRemoteId: 2, destinationRemoteId: 3 })
                .catch(err => expect(err).toBeDefined());
        });

        it('should throw an error, when no desitinationremote is found', async () => {
            jest.spyOn(remoteRepository, 'findOneItem').mockImplementation((id) => id === 3 ? null : {});
            imageService.cloneImage(1, { sourceRemoteId: 2, destinationRemoteId: 3 })
                .catch(err => expect(err).toBeDefined());
        });
    });

});
