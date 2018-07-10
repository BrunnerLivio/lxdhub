import { DatabaseModule } from '@lxdhub/db';
import { DynamicModule } from '@nestjs/common';

import { AppSettingsModule } from './app-settings/app-settings.module';
import { LXDHubDbSyncSettings } from './dbsync-settings.interface';
import { RemoteModule } from './remote';
import { LXDModule } from './lxd';
import { OperatingSystemModule } from './operating-system';
import { ArchitectureModule } from './architecture';
import { ImageModule } from './image';
import { AliasModule } from './alias/alias.module';
import { OperatingArchitectureModule } from './os-arch';
import { ImageAvailabilityModule } from './image-availability';
import { AppService } from './app.service';

/**
 * The main appliaction module for LXDHub database sync
 */
export class AppModule {
    /**
     * Returns the app module with the applied settings
     * @param settings The settings of the synchronization task
     */
    public static forRoot(settings: LXDHubDbSyncSettings): DynamicModule {
        return {
            module: AppModule,
            providers: [
                AppService
            ],
            imports: [
                DatabaseModule.forRoot({ ...settings.database }),
                AppSettingsModule.forRoot(settings),
                LXDModule,
                RemoteModule,
                OperatingSystemModule,
                ArchitectureModule,
                AliasModule,
                ImageModule,
                OperatingArchitectureModule,
                ImageAvailabilityModule
            ],
        };
    }
}
