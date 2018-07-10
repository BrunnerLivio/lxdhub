import { Module } from '@nestjs/common';
import { ArchitectureService } from './architecture.service';
import { LXDModule } from '../lxd';
import { ArchitectureRepositoryProvider } from './architecture.repository';

@Module({
    imports: [
        LXDModule
    ],
    providers: [
        ArchitectureService,
        ArchitectureRepositoryProvider
    ],
    exports: [
        ArchitectureService
    ]
})
export class ArchitectureModule { }
