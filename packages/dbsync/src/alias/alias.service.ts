import { Alias, Image } from '@lxdhub/db';
import { Inject, Logger, Injectable } from '@nestjs/common';
import Aigle from 'aigle';
import * as _ from 'lodash';

import { AliasDto } from '.';
import { LXDHubDbSyncSettings } from '../dbsync-settings.interface';
import { ImageService } from '../image';
import { LXDService } from '../lxd';
import { trimIfPossible } from '../util';
import { AliasRepository } from './';

@Injectable()
export class AliasService {
    private logger: Logger;

    constructor(
        private imageService: ImageService,
        @Inject('AliasRepository')
        private aliasRepository: AliasRepository,
        @Inject('LXDHubDbSyncSettings')
        private dbSyncSettings: LXDHubDbSyncSettings,
        private lxdService: LXDService
    ) {
        this.logger = new Logger('AliasService');
    }

    public aliasToDto(alias: any): AliasDto {
        return {
            name: trimIfPossible(alias.name),
            description: trimIfPossible(alias.description)
        };
    }

    public getAliases(remoteImage: any): AliasDto[] {
        return _.map(remoteImage.aliases, alias => this.aliasToDto(alias));
    }

    public mapAlias(localAlias: Alias, remoteAlias: AliasDto): Alias {
        localAlias.description = remoteAlias.description;
        localAlias.name = remoteAlias.name;
        return localAlias;
    }

    public async getOrCreate(remoteImage: any, remoteAlias: AliasDto): Promise<Alias> {
        const image: Image = await this.imageService.updateOrCreateImage(remoteImage);
        let localAlias = await this.aliasRepository
            .createQueryBuilder('alias')
            .leftJoinAndSelect('alias.image', 'image')
            .where('image.id = :imageId AND alias.name = :name', {
                imageId: image.id,
                name: remoteAlias.name
            })
            .getOne();

        if (!localAlias) {
            localAlias = await this.create(remoteAlias, image);
        } else {
            localAlias = await this.update(localAlias, remoteAlias);
        }
        return localAlias;
    }

    public async update(localAlias: Alias, remoteAlias: AliasDto): Promise<Alias> {
        localAlias = this.mapAlias(localAlias, remoteAlias);
        return this.aliasRepository.save(localAlias);
    }

    public async create(remoteAlias: AliasDto, image: Image): Promise<Alias> {
        this.logger.log(`Adding Alias ${remoteAlias.name}`);
        let localAlias = new Alias();
        localAlias.image = image;
        localAlias = this.mapAlias(localAlias, remoteAlias);
        return this.aliasRepository.save(localAlias);
    }

    public async synchronize() {
        this.logger.log('-> Starting Alias synchronization');

        await Aigle
            .resolve(this.dbSyncSettings.lxdhubConfig.remotes)
            .forEachSeries(async remote => {
                const images = await this.lxdService.getRemoteImages(remote);
                await Aigle
                    .resolve(images)
                    .forEachSeries(async remoteImage => {
                        const aliases = this.getAliases(remoteImage);
                        await Aigle
                            .resolve(aliases)
                            .forEachSeries(async alias => this.getOrCreate(remoteImage, alias));
                    });
            });
        this.logger.log('-> Finished Alias synchronization');
    }
}
