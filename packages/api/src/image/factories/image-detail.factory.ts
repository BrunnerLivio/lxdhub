import { Factory } from '@lxdhub/common';
import { Alias, Architecture, Image, ImageAvailability, OperatingSystem } from '@lxdhub/db';
import { Component, Injectable } from '@nestjs/common';

import { AliasDto, ArchitectureDto, ImageDetailDto, OperatingSystemDto, RemoteImageAvailabilityDto } from '..';

/**
 * Factory which produces ImageDetailDto
 */
@Injectable()
export class ImageDetailFactory extends Factory<ImageDetailDto> {
    /**
     * Maps the alias from the database with the AliasDto
     * @param alias The alias from the database
     */
    private aliasToDto(alias: Alias): AliasDto {
        const aliasDto = new AliasDto();
        if (alias) {
            aliasDto.name = alias.name;
            aliasDto.description = alias.description;
        }
        return aliasDto;
    }

    /**
     * Maps the architecture from the database to a architecturedto
     * @param architecture The architecture from the database
     */
    private architectureToDto(architecture: Architecture): ArchitectureDto {
        const architectureDto = new ArchitectureDto();
        if (architecture) {
            architectureDto.humanName = architecture.humanName;
            architectureDto.processorName = architecture.processorName;
        }
        return architectureDto;
    }

    /**
     * Maps the operating system from the database to a operating system dto
     * @param os The operating system from the database
     */
    private osToDto(os: OperatingSystem): OperatingSystemDto {
        const osDto = new OperatingSystemDto();
        if (os) {
            osDto.distribution = os.distribution;
            osDto.release = os.release;
            osDto.version = os.version;
        }
        return osDto;
    }

    /**
     * Transforms an imageAvailability object from the database
     * to a dto
     * @param imageAvailability The imageAvailability which should be transformed to a dto
     */
    private imageAvailabilityToDto(imageAvailability: ImageAvailability)
        : RemoteImageAvailabilityDto {
        // rIA shortname for remoteImageAvailability
        const rIADto = new RemoteImageAvailabilityDto();
        rIADto.cloneable = !imageAvailability.remote.readonly && !imageAvailability.available;
        rIADto.available = imageAvailability.available;
        rIADto.name = imageAvailability.remote.name;
        rIADto.id = imageAvailability.remote.id;
        return rIADto;
    }

    /**
     * Maps the given database image with the ImageDetailDto and returns
     * the instance
     * @param image The database image, which should be mapped with a ImageDetailDto
     */
    entityToDto(image: Image): ImageDetailDto {
        const imageDetail = new ImageDetailDto();
        imageDetail.id = image.id;
        imageDetail.fingerprint = image.fingerprint;
        imageDetail.uploadedAt = image.uploadedAt;
        imageDetail.description = image.description;
        imageDetail.aliases = image.aliases.map(alias => this.aliasToDto(alias));

        if (image.osArchitecture) {
            imageDetail.architecture = this.architectureToDto(image.osArchitecture.architecture);
            imageDetail.operatingSystem = this.osToDto(image.osArchitecture.operatingSystem);
        }

        imageDetail.autoUpdate = image.autoUpdate;
        imageDetail.createdAt = image.createdAt;
        imageDetail.expiresAt = image.expiresAt;
        imageDetail.size = image.size;
        imageDetail.public = image.public;
        imageDetail.remotes = image.imageAvailabilities
            .map(imageAvailability => this.imageAvailabilityToDto(imageAvailability));

        imageDetail.cloneable =
            imageDetail.remotes.some(remote => remote.cloneable) &&
            imageDetail.remotes.some(remote => remote.available);

        return imageDetail;
    }

}
