import { Module } from '@nestjs/common';

import { ImageModule } from '../image';
import { LXDModule } from '../lxd';
import { RemoteModule } from '../remote';
import { ImageAvailabilityRepositoryProvider } from './image-availability.repository';
import { ImageAvailabilityService } from './image-availability.service';

@Module({
    imports: [
        RemoteModule,
        ImageModule,
        LXDModule
    ],
    providers: [
        ImageAvailabilityService,
        ImageAvailabilityRepositoryProvider
    ],
    exports: [
        ImageAvailabilityService
    ]
})
export class ImageAvailabilityModule { }
