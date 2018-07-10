import { Alias, Image, Remote } from '@lxdhub/db';
import { Injectable } from '@nestjs/common';
import * as Fs from 'fs';
import * as Url from 'url';

import { AliasDto, SourceDto, SourceImageDto } from '../dto';

/**
 * Transforms the image and remotes from the database
 * to a SourceImageDto
 */
@Injectable()
export class SourceImageFactory {
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
     * Transforms the image and the sourceRemote into
     * a SourceDto
     * @param image The image from the database
     * @param sourceRemote The source remote from the database
     */
    private imageToSourceDto(image: Image, sourceRemote: Remote): SourceDto {
        const dto = new SourceDto();
        dto.server = sourceRemote.serverUrl;
        dto.protocol = 'lxd';
        dto.fingerprint = image.fingerprint;
        return dto;
    }

    /**
     * Transforms the given image to a Source Image Dto
     * @param image The image from the database
     * @param sourceRemote The source remote from the database
     * @param desinationRemote The destination remote from the database
     */
    entityToDto(image: Image, sourceRemote: Remote, desinationRemote: Remote): SourceImageDto {
        const dto = new SourceImageDto();
        dto.public = desinationRemote.public;
        dto.aliases = image.aliases.map(alias => this.aliasToDto(alias));
        dto.source = this.imageToSourceDto(image, sourceRemote);
        return dto;
    }
}
