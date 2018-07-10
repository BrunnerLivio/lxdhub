import { Module } from '@nestjs/common';
import { AliasService } from './';
import { AliasRepositoryProvider } from './alias.repository';
import { ImageModule, ImageService } from '../image';
import { LXDModule } from '../lxd';

@Module({
    imports: [
        LXDModule,
    ],
    providers: [
        AliasService,
        AliasRepositoryProvider,
    ],
    exports: [
        AliasService
    ]
})
export class AliasModule { }
