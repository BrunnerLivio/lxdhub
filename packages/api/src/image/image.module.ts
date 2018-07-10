import { Module } from '@nestjs/common';

import { ImageAvailabilityModule } from '../image-availability/';
import { LogModule } from '../log';
import { LXDModule } from '../lxd';
import { RemoteModule } from '../remote';
import { SearchModule } from '../search/search.module';
import { ImageDetailFactory, ImageListItemFactory } from './factories';
import { ImageSearchDictionaryProvider } from './image-search-dictionary.const';
import { ImageController } from './image.controller';
import { ImageGateway } from './image.gateway';
import { ImageRepositoryProvider } from './image.repository';
import { ImageService } from './image.service';

@Module({
  imports: [
    SearchModule,
    LXDModule,
    RemoteModule,
    ImageAvailabilityModule,
    LogModule
  ],
  controllers: [ImageController],
  providers: [
    ImageService,
    ImageRepositoryProvider,
    ImageListItemFactory,
    ImageDetailFactory,
    ImageSearchDictionaryProvider,
    ImageGateway
  ]
})
/**
 * The Image module, which bundles all
 * operational or processable image related
 * modules, controllers and components
 */
export class ImageModule { }
