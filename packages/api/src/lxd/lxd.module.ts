import { Module } from '@nestjs/common';
import { LXDService } from './lxd.service';
import { SourceImageFactory } from './factories';
import { RequestProvider } from '../third-party/';
import { AppSettingsModule } from '../app-settings';

/**
 * The LXDModule, which bundles all
 * operational or processable LXD related
 * modules, controllers and components
 */
@Module({
    providers: [
        LXDService,
        SourceImageFactory,
        RequestProvider
    ],
    exports: [LXDService]
})
export class LXDModule { }
