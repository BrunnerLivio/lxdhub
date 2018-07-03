import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { APP_SETTINGS } from './settings';


const start = async () => {
  const response = await fetch('/config.json');
  const settings = await response.json();

  // TODO: switch in dev mode
  enableProdMode();

  await platformBrowserDynamic([{
    useValue: settings,
    provide: APP_SETTINGS
  }])
    .bootstrapModule<AppModule>(AppModule);

};

start();
