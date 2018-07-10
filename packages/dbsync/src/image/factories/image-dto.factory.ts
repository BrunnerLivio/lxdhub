import { Image } from '@lxdhub/db';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ImageDtoFactory {
    dtoToEntity(remoteImage: any, localImage?: Image): Image {
        localImage = localImage || new Image();
        localImage.size = remoteImage.size;
        localImage.serial = remoteImage.properties.serial;
        localImage.description = remoteImage.properties.description;
        localImage.autoUpdate = remoteImage.auto_update;
        localImage.createdAt = remoteImage.created_at;
        localImage.expiresAt = remoteImage.expires_at;
        localImage.lastUsedAt = remoteImage.last_used_at;
        localImage.uploadedAt = remoteImage.uploaded_at;
        localImage.label = remoteImage.label;
        localImage.public = remoteImage.public;
        localImage.fingerprint = remoteImage.fingerprint;
        return localImage;
    }
}
