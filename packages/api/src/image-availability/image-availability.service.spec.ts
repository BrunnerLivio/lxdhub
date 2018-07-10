import { Image, ImageAvailability, Remote } from '@lxdhub/db';
import { Test } from '@nestjs/testing';

import { ImageAvailabilityRepository } from './image-availability.repository';
import { ImageAvailabilityService } from './image-availability.service';

class ImageAvailabilityRepositoryMock {
    getImageByRemoteAndImage() { }
    create() { }
}

/**
 * Test cases for the remote service
 */
describe('ImageAvailabilityService', () => {
    let imageAvailabilityService: ImageAvailabilityService;
    let imageAvailabilityRepository: ImageAvailabilityRepository;
    beforeEach(async done => {
        // Mock Remote Module
        const module = await Test.createTestingModule({
            providers: [
                ImageAvailabilityService,
                {
                    provide: 'ImageAvailabilityRepository',
                    useClass: ImageAvailabilityRepositoryMock
                }
            ]
        }).compile();

        imageAvailabilityService = module.get<ImageAvailabilityService>(ImageAvailabilityService);
        imageAvailabilityRepository = module.get<ImageAvailabilityRepository>(ImageAvailabilityRepository);
        done();
    });

    describe('getOrCreate', () => {
        /**
         * Returns or creates the imageavailability with the given
         * parameters
         */
        it('should create a new image availability', async () => {
            const image = { id: 1 } as Image;
            const remote = { id: 2 } as Remote;
            const imageAvailabilty = new ImageAvailability();
            imageAvailabilty.remote = remote;
            imageAvailabilty.image = image;
            imageAvailabilty.available = true;

            jest.spyOn(imageAvailabilityRepository, 'getImageByRemoteAndImage').mockImplementation(() => null);
            jest.spyOn(imageAvailabilityRepository, 'create').mockImplementation(() => imageAvailabilty);

            expect(await imageAvailabilityService.getOrCreate(image, remote, true)).toEqual(imageAvailabilty);
            expect(imageAvailabilityRepository.create).toHaveBeenCalledWith(imageAvailabilty);
            expect(imageAvailabilityRepository.getImageByRemoteAndImage).toHaveBeenCalledWith(2, 1);
        });
    });
});
