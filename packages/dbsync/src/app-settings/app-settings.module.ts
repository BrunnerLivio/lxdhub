import { DynamicModule, Global, Module } from '@nestjs/common';

import { LXDHubDbSyncSettings } from '../dbsync-settings.interface';

/**
 * The AppSettingsModule, which bundles all
 * operational or processable app-settings related
 * modules, controllers and components
 */
@Module({})
@Global()
export class AppSettingsModule {
    public static forRoot(settings: LXDHubDbSyncSettings): DynamicModule {
        const apiSettingsProvider = {
            provide: 'LXDHubDbSyncSettings',
            useFactory: () => settings
        };
        return {
            module: AppSettingsModule,
            providers: [
                apiSettingsProvider
            ],
            exports: [
                apiSettingsProvider
            ]
        };
    }
}
