import { Remote } from '@lxdhub/db';
import { Test } from '@nestjs/testing';

import { RemoteDto } from '../dtos';
import { RemoteFactory } from './remote.factory';

/**
 * Test cases for the RemotFactory
 */
describe('RemoteFactory', () => {
    let remoteFactory: RemoteFactory;
    let remotes = [];
    let dtos = [];

    beforeEach(async () => {
        // Mock Remote Module
        const module = await Test.createTestingModule({
            providers: [
                RemoteFactory
            ]
        }).compile();

        // Get the RemoteFactory
        remoteFactory = module.get<RemoteFactory>(RemoteFactory);
    });

    beforeEach(() => {
        const remote = new Remote();
        remote.id = 1;
        remote.name = 'images';
        remote.protocol = 'lxd';
        remote.public = true;
        remote.readonly = true;
        remote.serverUrl = 'https://images.efiks.ovh:8443';
        remotes = [remote];

        const remoteDto = new RemoteDto();
        remoteDto.id = 1;
        remoteDto.name = 'images';
        remoteDto.protocol = 'lxd';
        remoteDto.public = true;
        remoteDto.readonly = true;
        remoteDto.serverUrl = 'https://images.efiks.ovh:8443';
        dtos = [remoteDto];
    });

    describe('entitiesToDto', () => {
        it('should return RemoteDto-Array', async () => {
            expect(await remoteFactory.entitiesToDto(remotes)).toEqual(dtos);
        });
        it('should return RemoteDto', async () => {
            expect(await remoteFactory.entityToDto(remotes[0])).toEqual(dtos[0]);
        });
    });
});
