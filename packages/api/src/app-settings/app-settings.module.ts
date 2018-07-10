import { DynamicModule, Global, Module } from '@nestjs/common';

import { LXDHubAPISettings } from '..';
import { FsProvider } from '../third-party/fs.provider';

/**
 * The AppSettingsModule, which bundles all
 * operational or processable app-settings related
 * modules, controllers and components
 */
@Module({})
@Global()
export class AppSettingsModule {
    public static forRoot(settings?: LXDHubAPISettings): DynamicModule {
        const apiSettingsProvider = {
            provide: 'LXDHubAPISettings',
            useFactory: () => settings
        };
        return {
            module: AppSettingsModule,
            providers: [
                FsProvider,
                apiSettingsProvider
            ],
            exports: [
                apiSettingsProvider
            ]
        };
    }
}
