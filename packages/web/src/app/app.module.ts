import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SocketIoModule } from 'ng-socket-io';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ImageModule } from './components/image/image.module';
import { NavigationComponent } from './components/navigation/navigation.component';
import { LxdLogoComponent } from './components/shared/lxd-logo/lxd-logo.component';

@NgModule({
  declarations: [
    AppComponent,
    LxdLogoComponent,
    NavigationComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    NoopAnimationsModule,
    ImageModule,
    AppRoutingModule,
    SocketIoModule,
    LoggerModule.forRoot({
      level: NgxLoggerLevel.DEBUG,
      serverLogLevel: NgxLoggerLevel.DEBUG
    })
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
