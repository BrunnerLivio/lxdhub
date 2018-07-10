import { Image } from '@lxdhub/db';
import { Inject, Logger, Injectable } from '@nestjs/common';
import Aigle from 'aigle';

import { ImageRepository } from '.';
import { LXDHubDbSyncSettings } from '../dbsync-settings.interface';
import { LXDService } from '../lxd';
import { ImageDtoFactory } from './factories/image-dto.factory';

@Injectable()
export class ImageService {
    private logger: Logger;
    constructor(
        @Inject('ImageRepository')
        private imageRepository: ImageRepository,
        private imageDtoFactory: ImageDtoFactory,
        @Inject('LXDHubDbSyncSettings')
        private dbSyncSettings: LXDHubDbSyncSettings,
        private lxdService: LXDService
    ) {
        this.logger = new Logger('ImageService');
    }

    public async createImage(remoteImage: any): Promise<Image> {
        this.logger.log(`Adding image ${remoteImage.fingerprint}`);
        let localImage: Image = new Image();
        localImage = this.imageDtoFactory.dtoToEntity(remoteImage, localImage);
        await this.imageRepository.save(localImage);
        return localImage;
    }

    public async updateImage(localImage: Image, remoteImage: any): Promise<Image> {
        localImage = this.imageDtoFactory.dtoToEntity(remoteImage, localImage);
        await this.imageRepository.save(localImage);
        return localImage;
    }

    public async updateOrCreateImage(remoteImage: any): Promise<Image> {
        const localImage = await this.getImage(remoteImage);
        // Has Item
        if (localImage) {
            return this.updateImage(localImage, remoteImage);
        } else {
            return this.createImage(remoteImage);
        }
    }

    public async getImage(remoteImage: any): Promise<Image> {
        return await this.imageRepository.findOne({ fingerprint: remoteImage.fingerprint });
    }

    public async synchronize() {
        this.logger.log('-> Starting Image Synchronization');
        await Aigle
            .resolve(this.dbSyncSettings.lxdhubConfig.remotes)
            .forEachSeries(async remote => {
                const images = await this.lxdService.getRemoteImages(remote);
                return await Aigle
                    .resolve(images)
                    .forEachSeries(async remoteImage => await this.updateOrCreateImage(remoteImage));

            });
        this.logger.log('-> Finished Image Synchronization');
    }
}
