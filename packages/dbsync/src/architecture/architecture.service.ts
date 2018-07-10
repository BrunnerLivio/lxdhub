import { Architecture } from '@lxdhub/db';
import { Inject, Logger, Injectable } from '@nestjs/common';
import Aigle from 'aigle';
import * as _ from 'lodash';

import { ArchitectureDto, ArchitectureRepository } from '.';
import { LXDHubDbSyncSettings } from '../dbsync-settings.interface';
import { LXDService } from '../lxd';
import { trimIfPossible } from '../util';

@Injectable()
export class ArchitectureService {
    private logger: Logger;

    constructor(
        @Inject('ArchitectureRepository')
        private architectureRepository: ArchitectureRepository,
        @Inject('LXDHubDbSyncSettings')
        private dbSyncSettings: LXDHubDbSyncSettings,
        private lxdService: LXDService
    ) {
        this.logger = new Logger('ArchitectureService');
    }

    public remoteImageToDto(remoteImage: any): ArchitectureDto {
        return {
            processorName: trimIfPossible(remoteImage.architecture),
            humanName: trimIfPossible(remoteImage.properties.architecture)
        };
    }

    public getArchitectures(remoteImages: any[]): ArchitectureDto[] {
        return _.chain(remoteImages)
            .map(remoteImage => this.remoteImageToDto(remoteImage))
            .uniqWith(_.isEqual)
            .value();
    }

    public async getOrCreate(remoteArchitecture: ArchitectureDto): Promise<Architecture> {
        // Already exists
        let localArchitecture: Architecture = await this.architectureRepository.findOne({
            where: {
                humanName: remoteArchitecture.humanName,
                processorName: remoteArchitecture.processorName
            }
        });
        if (!localArchitecture) {
            localArchitecture = await this.create(remoteArchitecture);
        }
        return localArchitecture;
    }

    public async create(remoteArchitecture: ArchitectureDto): Promise<Architecture> {
        this.logger.log(`Adding Architecture ${remoteArchitecture.humanName}`);
        const localArchitecture = new Architecture();
        localArchitecture.humanName = remoteArchitecture.humanName;
        localArchitecture.processorName = remoteArchitecture.processorName;
        return this.architectureRepository.save(localArchitecture);
    }

    public async synchronize() {
        this.logger.log('-> Starting Architecture Synchronisation');
        return await Aigle
            .resolve(this.dbSyncSettings.lxdhubConfig.remotes)
            .forEachSeries(async remote => {
                const images = await this.lxdService.getRemoteImages(remote);

                await Aigle.resolve(this.getArchitectures(images))
                    .forEachSeries(image => this.getOrCreate(image));
            });
    }
}
