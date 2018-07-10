import { Factory } from '@lxdhub/common';
import { Remote } from '@lxdhub/db';
import { Injectable } from '@nestjs/common';

import { RemoteDto } from '../';

/**
 * Factory which prodcues RemoteDtos
 */
@Injectable()
export class RemoteFactory {
    /**
     * Maps the given RemoteDto with the database Remote and returns
     * the instance
     * @param image The RemoteDto, which should be mapped with a database Remote
     */
    dtoToEntity(externalRemote: RemoteDto, localRemote?: Remote): Remote {
        // Aliases
        const lR = localRemote || new Remote();
        const eR = externalRemote;
        lR.name = eR.name;
        lR.protocol = eR.protocol;
        lR.public = eR.public;
        lR.readonly = eR.readonly;
        lR.serverUrl = eR.url;
        return lR;
    }
}
