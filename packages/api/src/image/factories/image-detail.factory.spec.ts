import 'reflect-metadata';

import { AliasDto, ArchitectureDto, ImageDetailDto, OperatingSystemDto } from '..';
import {
    Alias,
    Architecture,
    Image,
    ImageAvailability,
    OperatingSystem,
    OperatingSystemArchitecture,
    Remote,
} from '@lxdhub/db';
import { Test } from '@nestjs/testing';

import { ImageDetailFactory } from '.';

/**
 * Test cases for the ImageDetailFactory
 */
describe('ImageDetailFactory', () => {
    let imageDetailFactory: ImageDetailFactory;
    let images = [];
    let dtos = [];

    beforeEach(async () => {
        // Mock Image Module
        const module = await Test.createTestingModule({
            providers: [
                ImageDetailFactory
            ]
        }).compile();

        // Get the image detail factory
        imageDetailFactory = module.get<ImageDetailFactory>(ImageDetailFactory);
    });

    beforeEach(() => {
        const date1 = new Date();
        const image1 = new Image();
        const alias = new Alias();
        const architecture = new Architecture();
        const operatingSystem = new OperatingSystem();
        const osArch = new OperatingSystemArchitecture();
        const imageAvailability = new ImageAvailability();
        const remote = new Remote();

        remote.id = 1;
        remote.name = 'remotename';
        remote.public = true;
        remote.readonly = true;

        imageAvailability.remote = remote;
        imageAvailability.available = true;

        architecture.humanName = 'amd64';
        architecture.processorName = 'amd64';

        operatingSystem.distribution = 'ubuntu';
        operatingSystem.release = 'xenial';
        operatingSystem.version = '16.04';

        osArch.operatingSystem = operatingSystem;
        osArch.architecture = architecture;

        alias.image = image1;
        alias.name = 'alias1';
        alias.id = 1;
        alias.description = 'desc1';

        image1.fingerprint = 'fingerprint1';
        image1.uploadedAt = date1;
        image1.description = 'desc1';
        image1.id = 1;
        image1.expiresAt = new Date();
        image1.autoUpdate = true;
        image1.createdAt = date1;
        image1.aliases = [alias];
        image1.osArchitecture = osArch;
        image1.createdAt = date1;
        image1.expiresAt = date1;
        image1.size = 13;
        image1.public = true;
        image1.imageAvailabilities = [imageAvailability];

        images = [image1];

        const dto1 = new ImageDetailDto();

        const aliasDto = new AliasDto();
        aliasDto.description = 'desc1';
        aliasDto.name = 'alias1';

        const architectureDto = new ArchitectureDto();
        architectureDto.processorName = 'amd64';
        architectureDto.humanName = 'amd64';

        const osDto = new OperatingSystemDto();

        osDto.distribution = 'ubuntu';
        osDto.release = 'xenial';
        osDto.version = '16.04';

        dto1.fingerprint = 'fingerprint1';
        dto1.uploadedAt = date1;
        dto1.description = 'desc1';
        dto1.aliases = [aliasDto];
        dto1.autoUpdate = true;
        dto1.architecture = architectureDto;
        dto1.operatingSystem = osDto;
        dto1.id = 1;
        dto1.expiresAt = date1;
        dto1.createdAt = date1;
        dto1.size = 13;
        dto1.public = true;
        dto1.cloneable = false;
        dto1.remotes = [
            { id: 1, cloneable: false, available: true, name: 'remotename' }
        ];

        dtos = [dto1];
    });

    describe('entitiesToDto', () => {
        it('should return ImageListItem-Array', async () => {
            expect(await imageDetailFactory.entitiesToDto(images)).toEqual(dtos);
        });
        it('should return ImageListItem', async () => {
            expect(await imageDetailFactory.entityToDto(images[0])).toEqual(dtos[0]);
        });
    });
});
