import { Body, Controller, HttpStatus, Post } from '@nestjs/common';

import { LogService } from '.';
import { LogDto } from './dtos';

/**
 * The Remote-Controller, which is the API
 * interface for Remote-Operations.
 */
@Controller('log')
export class LogController {
    logger: LogService;
    /**
     * Initializes the controller
     */
    constructor(
    ) {
        this.logger = new LogService('LXDHubWeb');
    }

    /**
     * Returns all remotes
     */
    @Post('')
    log(@Body() log: LogDto) {
        const message = log.message;

        if (log.level === 'WARN') {
            this.logger.warn(message);
        } else if (log.level === 'ERROR') {
            this.logger.error(message);
        } else {
            this.logger.log(message);
        }

        return HttpStatus.OK;
    }
}
