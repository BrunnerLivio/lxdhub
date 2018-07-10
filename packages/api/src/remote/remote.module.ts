import { Image } from '@lxdhub/db';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RemoteFactory } from './factories';
import { RemoteController } from './remote.controller';
import { RemoteRepositoryProvider } from './remote.repository';
import { RemoteService } from './remote.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Image])
  ],
  controllers: [RemoteController],
  providers: [
    RemoteFactory,
    RemoteService,
    RemoteRepositoryProvider
  ],
  exports: [
    RemoteService,
    RemoteRepositoryProvider,
    RemoteFactory
  ]
})
/**
 * The remote module, which bundles all
 * operational or processable remote related
 * modules, controllers and components
 */
export class RemoteModule { }
