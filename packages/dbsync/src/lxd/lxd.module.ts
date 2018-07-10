import { Module } from '@nestjs/common';

import { LXDService } from './lxd.service';

/**
 * The LXDModule for LXD api operations
 */
@Module({
    providers: [
        LXDService
    ],
    exports: [
        LXDService
    ]
})
export class LXDModule { }
