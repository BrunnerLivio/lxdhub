import { Inject, Logger, Injectable } from '@nestjs/common';
import { ImageDetail, LXDRemoteClient } from 'node-lxd-client';

import { LXDHubDbSyncSettings } from '../dbsync-settings.interface';
import { RemoteDto } from '../remote';

@Injectable()
export class LXDService {
    private lxd: LXDRemoteClient;
    private logger: Logger;
    private images: any[] = [];

    constructor(
        @Inject('LXDHubDbSyncSettings')
        private dbSyncSettings: LXDHubDbSyncSettings
    ) {
        this.logger = new Logger('LXDService');
    }

    private async getLXDClientConfig(remote: RemoteDto) {
        let config;
        if (remote.password) {
            config = {
                host: remote.url,
                cert: this.dbSyncSettings.lxd.cert,
                key: this.dbSyncSettings.lxd.key,
                password: remote.password
            };
        } else {
            config = { host: remote.url };
        }
        return config;
    }

    private async loadRemoteImages(remote: RemoteDto): Promise<ImageDetail[]> {
        const lxdConfig = await this.getLXDClientConfig(remote);
        this.lxd = new LXDRemoteClient(lxdConfig);

        if (remote.password) {
            this.logger.log(`Authorizing certificate for remote ${remote.url}`);
            try {
                await this.lxd.authorizeCertificate();
                this.logger.log(`Succesfully authorized certificate for remote ${remote.url}`);
            } catch (exception) {
                this.logger.error(`Could not access ${remote.url}`);
            }
        }

        this.logger.log(`Fetching remote images of ${remote.url}`);
        let remoteImages: ImageDetail[];
        try {
            remoteImages = await this.lxd.image.all({
                lazy: false,
                sequentially: true
            });
        } catch (exception) {
            this.logger.error(`Could not fetch remote images`);
            this.logger.error(exception);
            return [];
        }

        if (!remoteImages) {
            this.logger.log('No images found on LXD server');
            return [];
        }

        this.logger.log(`Found ${remoteImages.length} images`);

        return remoteImages;
    }

    public async getRemoteImages(remote: RemoteDto) {
        if (!this.images[remote.name]) {
            this.images[remote.name] = await this.loadRemoteImages(remote);
        }
        return this.images[remote.name];
    }
}
