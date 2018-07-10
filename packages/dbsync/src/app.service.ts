import { DatabaseService } from '@lxdhub/db';
import { Logger, Injectable } from '@nestjs/common';

import { AliasService } from './alias';
import { ArchitectureService } from './architecture';
import { ImageService } from './image';
import { ImageAvailabilityService } from './image-availability';
import { OperatingSystemService } from './operating-system';
import { OsArchService } from './os-arch';
import { RemoteService } from './remote';
import { NestEnvironment } from '@nestjs/common/enums/nest-environment.enum';

@Injectable()
/**
 * The app services orchastrates the database synchronizer
 */
export class AppService {
    private logger: Logger;

    /**
     * Initializes the app service
     */
    constructor(
        private remoteService: RemoteService,
        private operatingSystemService: OperatingSystemService,
        private architectureService: ArchitectureService,
        private imageService: ImageService,
        private aliasService: AliasService,
        private osArchService: OsArchService,
        private imageAvailabilityService: ImageAvailabilityService,
        private databaseService: DatabaseService
    ) {
        this.logger = new Logger('Database Synchronizer');
    }

    /**
     * Start the database synchronizer.
     */
    async synchronize() {
        this.logger.log('==> Starting database synchronization');

        // Run the synchronizers
        await this.remoteService.synchronize();
        await this.imageService.synchronize();
        await this.operatingSystemService.synchronize();
        await this.architectureService.synchronize();
        await this.aliasService.synchronize();
        await this.osArchService.synchronize();
        await this.imageAvailabilityService.synchronize();

        // Closes the database connection
        await this.databaseService.closeConnection();
        this.logger.log('==> Finished database synchronization');
    }

}
