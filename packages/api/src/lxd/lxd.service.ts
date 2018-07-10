import { Image, Remote } from '@lxdhub/db';
import { Component, Inject, InternalServerErrorException } from '@nestjs/common';
import * as Request from 'request-promise';

import { LXDHubAPISettings } from '..';
import { SourceImageFactory } from './factories';

@Component()
export class LXDService {
    constructor(
        private sourceImageFactory: SourceImageFactory,
        @Inject('Request')
        private request: Request,
        @Inject('LXDHubAPISettings')
        private settings: LXDHubAPISettings
    ) { }

    /**
     * Requests a new image on the given remote
     * @param url The url to which the image should be request
     * @param sourceImageDto The image
     */
    private async requestNewImage(url: string, sourceImageDto) {
        const options: any = {
            url,
            json: sourceImageDto,
            rejectUnauthorized: false
        };

        if (this.settings.lxd && this.settings.lxd.key) {
            options.key = this.settings.lxd.key;
        }

        if (this.settings.lxd && this.settings.lxd.cert) {
            options.cert = this.settings.lxd.cert;
        }

        return await this.request.post(options);
    }

    /**
     * Waits for the given operation to end
     * @param url The operation url
     */
    private async waitForOperation(url) {
        const options: any = {
            url,
            rejectUnauthorized: false
        };

        if (this.settings.lxd && this.settings.lxd.key) {
            options.key = this.settings.lxd.key;
        }

        if (this.settings.lxd && this.settings.lxd.cert) {
            options.cert = this.settings.lxd.cert;
        }

        return await this.request.get(options);
    }

    /**
     * Clones the image from the given sourceRemote to the given destinationRemote
     * @param image The image to be cloned
     * @param sourceRemote The source remote, from which the images comes from
     * @param destinationRemote The destination Remote
     */
    async cloneImage(image: Image, sourceRemote: Remote, destinationRemote: Remote): Promise<string> {
        const sourceImageDto = this.sourceImageFactory.entityToDto(image, sourceRemote, destinationRemote);
        const url = destinationRemote.serverUrl;

        // Start operation
        try {
            const operation = await this.requestNewImage(`${url}/1.0/images`, sourceImageDto);
            // The operation uuid
            return operation.metadata.id;
        }
        catch (err) {
            if (err && err.error_code === 403) {
                throw new InternalServerErrorException('Server certificate is not valid. Contact a server administrator');
            }
            if (err && err.error_code === 500) {
                throw new InternalServerErrorException('The destination LXD remote is not reachable');
            }
            throw err;
        }
    }

    /**
     * Waits for the clone operation and returns the result
     * @param destinationRemote The destination remote
     * @param uuid The operation UUID from the LXD server
     */
    async getCloneStatus(destinationRemote: Remote, uuid: string) {
        return await this.waitForOperation(`${destinationRemote.serverUrl}/1.0/operations/${uuid}/wait`);
    }
}
