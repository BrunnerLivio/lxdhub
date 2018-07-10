import 'reflect-metadata';

import { ImageListItemDto } from '../dtos';
import { Image } from '@lxdhub/db';
import { Test } from '@nestjs/testing';

import { ImageListItemFactory } from './image-list-item.factory';

/**
 * Test cases for the ImageListItemFactory
 */
describe('ImageListItemFactory', () => {
    let imageListItemFactory: ImageListItemFactory;
    let images = [];
    let dtos = [];

    beforeEach(async () => {
        // Mock Image Module
        const module = await Test.createTestingModule({
            providers: [
                ImageListItemFactory
            ]
        }).compile();

        // Get the ImageListItemFatory
        imageListItemFactory = module.get<ImageListItemFactory>(ImageListItemFactory);
    });

    beforeEach(() => {
        const uploadedAtDate1 = new Date();
        const uploadedAtDate2 = new Date();
        const image1 = new Image();
        image1.fingerprint = 'fingerprint1';
        image1.uploadedAt = uploadedAtDate1;
        image1.description = 'desc1';
        image1.id = 1;
        image1.expiresAt = new Date();

        const image2 = new Image();
        image2.fingerprint = 'fingerprint2';
        image2.uploadedAt = uploadedAtDate2;
        image2.description = 'desc2';
        image2.id = 2;

        images = [image1, image2];

        const dto1 = new ImageListItemDto();
        dto1.fingerprint = 'fingerprint1';
        dto1.uploadedAt = uploadedAtDate1;
        dto1.description = 'desc1';
        dto1.id = 1;

        const dto2 = new ImageListItemDto();
        dto2.fingerprint = 'fingerprint2';
        dto2.uploadedAt = uploadedAtDate2;
        dto2.description = 'desc2';
        dto2.id = 2;

        dtos = [dto1, dto2];
    });

    describe('entitiesToDto', () => {
        it('should return ImageListItem-Array', async () => {
            expect(await imageListItemFactory.entitiesToDto(images)).toEqual(dtos);
        });
        it('should return ImageListItem', async () => {
            expect(await imageListItemFactory.entityToDto(images[0])).toEqual(dtos[0]);
            expect(await imageListItemFactory.entityToDto(images[1])).toEqual(dtos[1]);
        });
    });
});
