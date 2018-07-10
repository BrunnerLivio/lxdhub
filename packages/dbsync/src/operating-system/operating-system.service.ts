import { OperatingSystem } from '@lxdhub/db';
import { Inject, Logger, Injectable } from '@nestjs/common';
import Aigle from 'aigle';
import * as _ from 'lodash';

import { OperatingSystemDto } from '.';
import { LXDHubDbSyncSettings } from '../dbsync-settings.interface';
import { LXDService } from '../lxd';
import { trimIfPossible } from '../util';
import { OperatingSystemRepository } from './operating-system.repository';

@Injectable()
export class OperatingSystemService {
    private logger: Logger;
    constructor(
        @Inject('OperatingSystemRepository')
        private operatingSystemRepository: OperatingSystemRepository,
        private lxdService: LXDService,
        @Inject('LXDHubDbSyncSettings')
        private dbSyncSettings: LXDHubDbSyncSettings
    ) {
        this.logger = new Logger('OperatingSystemService');
    }

    public remoteImageToDto(remoteImage: any): OperatingSystemDto {
        return {
            version: trimIfPossible(remoteImage.properties.version),
            release: trimIfPossible(remoteImage.properties.release),
            distribution: trimIfPossible(remoteImage.properties.os)
        };
    }

    public getOperatingSystems(remoteImages: any[]): OperatingSystemDto[] {
        return _.chain(remoteImages)
            .map(remoteImage => this.remoteImageToDto(remoteImage))
            .uniqWith(_.isEqual)
            .value();
    }

    public async getOrCreate(remoteOperatingSystem: OperatingSystemDto): Promise<OperatingSystem> {
        // Already exists
        let localOperatingSystem: OperatingSystem = await this.operatingSystemRepository.findOne({
            where: {
                version: remoteOperatingSystem.version,
                release: remoteOperatingSystem.release,
                distribution: remoteOperatingSystem.distribution
            }
        });
        if (!localOperatingSystem) {
            localOperatingSystem = await this.create(remoteOperatingSystem);
        }
        return localOperatingSystem;
    }

    public async create(remoteOperatingSystem: OperatingSystemDto): Promise<OperatingSystem> {
        this.logger.log(`Adding OperatingSystem ` +
            `${remoteOperatingSystem.distribution} ` +
            `${remoteOperatingSystem.release} ` +
            `${remoteOperatingSystem.version}`);

        const localOperatingSystem = new OperatingSystem();
        localOperatingSystem.version = remoteOperatingSystem.version;
        localOperatingSystem.release = remoteOperatingSystem.release;
        localOperatingSystem.distribution = remoteOperatingSystem.distribution;
        return this.operatingSystemRepository.save(localOperatingSystem);
    }

    private async imagesDtosToEntity(images: any[]) {
        return await Aigle.forEachSeries(
            this.getOperatingSystems(images),
            async image => await this.getOrCreate(image));
    }

    public async synchronize() {
        this.logger.log('-> Starting Operating System Synchronisation');
        return await Aigle
            .resolve(this.dbSyncSettings.lxdhubConfig.remotes)
            .forEachSeries(async remote => {
                const images = await this.lxdService.getRemoteImages(remote);
                await this.imagesDtosToEntity(images);
            });
    }
}
