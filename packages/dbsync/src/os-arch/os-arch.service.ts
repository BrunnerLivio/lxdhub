import { Architecture, OperatingSystem, OperatingSystemArchitecture } from '@lxdhub/db';
import { Inject, Logger, Injectable } from '@nestjs/common';
import Aigle from 'aigle';
import * as _ from 'lodash';

import { OperatingSystemArchitectureRepository, OsArchDto } from '.';
import { ArchitectureService } from '../architecture/architecture.service';
import { LXDHubDbSyncSettings } from '../dbsync-settings.interface';
import { ImageRepository } from '../image';
import { ImageService } from '../image/image.service';
import { LXDService } from '../lxd';
import { OperatingSystemService } from '../operating-system';

@Injectable()
export class OsArchService {
    private logger: Logger;
    constructor(
        @Inject('OperatingSystemArchitectureRepository')
        private osArchRepository: OperatingSystemArchitectureRepository,
        private architectureService: ArchitectureService,
        private operatingSystemService: OperatingSystemService,
        private imageService: ImageService,
        @Inject('ImageRepository')
        private imageRepository: ImageRepository,
        @Inject('LXDHubDbSyncSettings')
        private dbSyncSettings: LXDHubDbSyncSettings,
        private lxdService: LXDService
    ) {
        this.logger = new Logger('OsArchService');
    }

    public remoteImageToDto(remoteImage: any): OsArchDto {
        return {
            architecture: this.architectureService.remoteImageToDto(remoteImage),
            operatingSystem: this.operatingSystemService.remoteImageToDto(remoteImage),
            remoteImage
        };
    }

    public getOsArchs(remoteImages: any[]): OsArchDto[] {
        return _.chain(remoteImages)
            .map(remoteImage => this.remoteImageToDto(remoteImage))
            .uniqWith((a, b) =>
                _.isEqual(a.architecture, b.architecture) && _.isEqual(a.operatingSystem, b.operatingSystem))
            .value();
    }

    public async getOrCreate(remoteOsArch: OsArchDto): Promise<OperatingSystemArchitecture> {
        const os = await this.operatingSystemService.getOrCreate(remoteOsArch.operatingSystem);
        const osId = os.id;

        const arch = await this.architectureService.getOrCreate(remoteOsArch.architecture);
        const archId = arch.id;
        // Already exists
        let localOsArch: OperatingSystemArchitecture = await this.osArchRepository
            .createQueryBuilder('osarch')
            .leftJoinAndSelect('osarch.architecture', 'arch')
            .leftJoinAndSelect('osarch.operatingSystem', 'os')
            .where('arch.id = :archId AND os.id = :osId', { archId, osId })
            .getOne();
        if (!localOsArch) {
            localOsArch = await this.create({
                arch,
                os
            });
        }

        const image = await this.imageService.getImage(remoteOsArch.remoteImage);
        image.osArchitecture = localOsArch;
        this.imageRepository.save(image);
        return localOsArch;
    }

    public async create(osArch: { arch: Architecture, os: OperatingSystem }): Promise<OperatingSystemArchitecture> {
        this.logger.log(`Adding OperatingSystem Architecture ` +
            `${osArch.arch.humanName} ${osArch.os.distribution}`);
        const localOsArch = new OperatingSystemArchitecture();
        localOsArch.architecture = osArch.arch;
        localOsArch.operatingSystem = osArch.os;
        return this.osArchRepository.save(localOsArch);
    }

    async synchronize() {
        this.logger.log('-> Starting OperatingSystem-Architecture synchronization');
        await Aigle
            .resolve(this.dbSyncSettings.lxdhubConfig.remotes)
            .forEachSeries(async remote => {
                const images = await this.lxdService.getRemoteImages(remote);
                const osArchs = this.getOsArchs(images);
                return await Aigle
                    .resolve(osArchs)
                    .forEachSeries(async (osArch) => await this.getOrCreate(osArch));
            });
        this.logger.log('-> Finished OperatingSystem-Architecture synchronization');
    }
}
