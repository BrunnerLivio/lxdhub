import { Module } from '@nestjs/common';

import { RemoteFactory, RemoteService } from './';
import { RemoteRepositoryProvider } from './remote.repository';
import { LXDModule } from '../lxd';

@Module({
    imports: [
        LXDModule
    ],
    providers: [
        RemoteFactory,
        RemoteService,
        RemoteRepositoryProvider
    ],
    exports: [
        RemoteService,
        RemoteRepositoryProvider
    ]
})
export class RemoteModule { }
