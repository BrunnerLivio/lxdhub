import { AppSettings } from '../src/settings';

/**
 * The settings for the web interface
 * of lxdhub
 */
export interface LXDHubWebSettings extends AppSettings {
    /**
     * The port on which the web interface should
     * be run at
     */
    port: number;
    /**
     * The host url on which the web interface should
     * be run at
     */
    hostUrl: string;
}
