import { ILXDHubService } from '.';
import { Application } from 'express';

/**
 * Represents a microservice, which LXDHub offers
 */
export interface ILXDHubHttpService extends ILXDHubService {
    /**
     * Bootstraps the application and returns the express
     * instance
     */
    bootstrap(): Promise<Application>;
}
