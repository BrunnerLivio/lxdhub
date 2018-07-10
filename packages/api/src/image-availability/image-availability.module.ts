import { ImageAvailability } from '@lxdhub/db';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ImageAvailabilityRepositoryProvider } from './image-availability.repository';
import { ImageAvailabilityService } from './image-availability.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([ImageAvailability]),
    ],
    controllers: [],
    providers: [
        ImageAvailabilityService,
        ImageAvailabilityRepositoryProvider
    ],
    exports: [ImageAvailabilityService]
})
/**
 * The Image Availability module, which bundles all
 * operational or processable image availability related
 * modules, controllers and components
 */
export class ImageAvailabilityModule { }
