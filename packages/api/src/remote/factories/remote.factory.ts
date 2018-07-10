import { RemoteDto} from '..';
import { Factory } from '@lxdhub/common';
import { Remote } from '@lxdhub/db';
import { Injectable } from '@nestjs/common';

/**
 * Factory which produces RemoteDtos
 */
@Injectable()
export class RemoteFactory extends Factory<RemoteDto> {
    /**
     * Maps the given database remote with the RemoteDtos and returns
     * the instances
     * @param remote The database remote, which should be mapped with a RemoteDto
     */
    entityToDto(remote: Remote): RemoteDto {
        const remoteDto = new RemoteDto();
        remoteDto.name = remote.name;
        remoteDto.protocol = remote.protocol;
        remoteDto.public = remote.public;
        remoteDto.readonly = remote.readonly;
        remoteDto.serverUrl = remote.serverUrl;
        remoteDto.id = remote.id;
        return remoteDto;
    }

    /**
     * Maps the given database remotes with the RemoteDtos and returns
     * the instances as array
     * @param remotes The database remotes, which should be mapped with ImageListItemDtos
     */
    entitiesToDto(remotes: Remote[]): RemoteDto[] {
        return remotes.map(remote => this.entityToDto(remote));
    }
}
