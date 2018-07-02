import { APP_SETTINGS, AppSettings } from './settings';

export const SettingsMock: AppSettings = {
    apiUrl: 'localhost:3000',
    loggingUrl: 'localhost:3000/api/v1/log',
    logLevel: 'silly'
};

export const SettingsMockProvider = {
    useValue: SettingsMock,
    provide: APP_SETTINGS
};
