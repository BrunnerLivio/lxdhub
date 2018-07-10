import { Test } from '@nestjs/testing';

import { ImageDetailDto, ImageListItemDto } from './dtos';
import { ImageController } from './image.controller';
import { ImageService } from './image.service';

class ImageServiceMock {
    async findByRemote() { }
    async findOne() { }
    async cloneImage() { }

}
/**
 * Test cases for the image controller
 */
describe('ImageController', () => {
    let imageController: ImageController;
    let imageService: ImageService;

    beforeEach(async () => {
        // Mock Image Module
        const module = await Test.createTestingModule({
            controllers: [ImageController],
            modules: [
            ],
            providers: [
                {
                    provide: 'ImageService',
                    useClass: ImageServiceMock
                }
            ]
        }).compile();

        // Get the imageController and imageService in the Testing Module Context
        imageController = module.get<ImageController>(ImageController);
        imageService = module.get<ImageService>(ImageService);
    });

    describe('findByRemote', () => {
        /**
         * Request images per remote
         */
        it('should return ImageListItems by remote', async () => {
            const result: ImageListItemDto[] = [{
                fingerprint: 'fingerprint1',
                description: 'desc1',
                uploadedAt: new Date(),
                id: 1,
                _links: {
                    detail: 'http://localhost:3000/api/v1/image/1'
                }
            }, {
                fingerprint: 'fingerprint2',
                description: 'desc2',
                uploadedAt: new Date(),
                id: 2,
                _links: {
                    detail: 'http://localhost:3000/api/v1/image/2'
                }
            }];

            jest.spyOn(imageService, 'findByRemote').mockImplementation(() => result);
            expect(await imageController.findByRemote({ limit: 20, offset: 0, remoteId: 1 })).toBe(result);
        });
    });

    describe('findOne', () => {
        it('should return ImageDetail', async () => {
            const result: ImageDetailDto = {
                fingerprint: 'fingerprint1',
                description: 'desc1',
                uploadedAt: new Date(),
                id: 1,
                aliases: [{ description: '', name: '' }],
                architecture: { humanName: '', processorName: '' },
                autoUpdate: true,
                expiresAt: new Date(),
                label: '',
                lastUsedAt: new Date(),
                operatingSystem: { distribution: '', release: '', version: '' },
                serial: '',
                size: 1,
                createdAt: new Date(),
                public: true,
                remotes: [
                    { available: true, cloneable: false, id: 1, name: 'remote1' }
                ],
                cloneable: false
            };

            jest.spyOn(imageService, 'findOne').mockImplementation(() => result);

            expect(await imageController.findOne(1)).toBe(result);
        });
    });

    describe('clone', () => {
        it('should clone an image', async () => {
            const result: ImageDetailDto = {
                fingerprint: 'fingerprint1',
                description: 'desc1',
                uploadedAt: new Date(),
                id: 1,
                aliases: [{ description: '', name: '' }],
                architecture: { humanName: '', processorName: '' },
                autoUpdate: true,
                expiresAt: new Date(),
                label: '',
                lastUsedAt: new Date(),
                operatingSystem: { distribution: '', release: '', version: '' },
                serial: '',
                size: 1,
                createdAt: new Date(),
                public: true,
                remotes: [
                    { available: true, cloneable: false, id: 1, name: 'remote1' }
                ],
                cloneable: false
            };

            jest.spyOn(imageService, 'cloneImage').mockImplementation(() => result);

            expect(await imageController.clone(1, { sourceRemoteId: 1, destinationRemoteId: 2 })).toBe(result);
            expect(imageService.cloneImage).toHaveBeenCalledWith(1, { sourceRemoteId: 1, destinationRemoteId: 2 });
        });
    });
});
