import { Interfaces } from '@lxdhub/common';
import { Remote } from '@lxdhub/db';
import { Inject, Logger, Injectable } from '@nestjs/common';

import { LXDHubDbSyncSettings } from '../dbsync-settings.interface';
import { RemoteDto, RemoteRepository } from './';
import { RemoteFactory } from './factories/remote.factory';

@Injectable()
export class RemoteService {
    private logger: Logger;

    constructor(
        @Inject('RemoteRepository')
        private remoteRepository: RemoteRepository,
        private remoteFactory: RemoteFactory,
        @Inject('LXDHubDbSyncSettings')
        private dbSyncSettings: LXDHubDbSyncSettings
    ) {
        this.logger = new Logger('RemoteService');
    }

    public async createRemote(externalRemote: RemoteDto): Promise<Remote> {
        this.logger.log(`Creating remote ${externalRemote.url}`);
        const localRemote = this.remoteFactory.dtoToEntity(externalRemote, new Remote());
        return await this.remoteRepository.save(localRemote);
    }

    public async updateRemote(externalRemote: RemoteDto, localRemote: Remote): Promise<Remote> {
        this.logger.log(`Updating remote ${externalRemote.url}`);
        localRemote = this.remoteFactory.dtoToEntity(externalRemote, localRemote);
        return await this.remoteRepository.save(localRemote);
    }

    public async getOrUpdate(settingsRemote: Interfaces.IRemoteConfig): Promise<Remote> {
        const remoteByName = await this.remoteRepository.findOne({ name: settingsRemote.name });
        const remoteByUrl = await this.remoteRepository.findOne({ serverUrl: settingsRemote.url });
        const remote = remoteByName || remoteByUrl;
        if (remote) {
            return await this.updateRemote(settingsRemote, remote);
        } else {
            return await this.createRemote(settingsRemote);
        }
    }

    public async synchronize() {
        this.logger.log('-> Starting Remote Synchronization');
        await Promise.all(this
            .dbSyncSettings
            .lxdhubConfig
            .remotes
            .map(async (settingsRemote) => await this.getOrUpdate(settingsRemote)));
        this.logger.log('-> Finished Remote Synchronization');
    }
}
