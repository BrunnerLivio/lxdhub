import { Module } from '@nestjs/common';

import { OsArchService } from './os-arch.service';
import { OperatingSystemArchitectureRepositoryProvider } from './os-arch.repository';
import { ArchitectureModule } from '../architecture';
import { ImageModule } from '../image';
import { LXDModule } from '../lxd';
import { OperatingSystemModule } from '../operating-system';

@Module({
    imports: [
        ImageModule,
        LXDModule,
        ArchitectureModule,
        OperatingSystemModule
    ],
    providers: [
        OsArchService,
        OperatingSystemArchitectureRepositoryProvider
    ],
    exports: [
        OsArchService
    ]
})
export class OperatingArchitectureModule { }
