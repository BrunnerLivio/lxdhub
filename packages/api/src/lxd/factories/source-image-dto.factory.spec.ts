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

import { SourceImageFactory } from './source-image-dto.factory';

/**
 * Test cases for the ImageDetailFactory
 */
describe('SourceImageFactory', () => {
    let sourceImageFactory: SourceImageFactory;

    const date1 = new Date();
    const image1 = new Image();
    const alias = new Alias();
    const architecture = new Architecture();
    const operatingSystem = new OperatingSystem();
    const osArch = new OperatingSystemArchitecture();
    const imageAvailability = new ImageAvailability();
    const remote = new Remote();
    let sourceRemote: Remote;
    let destinationRemote: Remote;

    beforeEach(async () => {
        // Mock Image Module
        const module = await Test.createTestingModule({
            providers: [
                SourceImageFactory
            ]
        }).compile();

        // Get the image detail factory
        sourceImageFactory = module.get<SourceImageFactory>(SourceImageFactory);
    });

    beforeEach(() => {
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
        sourceRemote = { id: 1, serverUrl: 'https://source.ch' } as Remote;
        destinationRemote = { id: 1, serverUrl: 'https://destination.ch', public: false } as Remote;

    });

    it('should transform to the correct dto', () => {
        const sourceImage = sourceImageFactory.entityToDto(image1, sourceRemote, destinationRemote);
        expect(sourceImage.public).toBe(false);
        expect(sourceImage.source.server).toBe(sourceRemote.serverUrl);
        expect(sourceImage.source.mode).toBe('pull');
        expect(sourceImage.source.protocol).toBe('lxd');
        expect(sourceImage.source.type).toBe('image');
    });
});
