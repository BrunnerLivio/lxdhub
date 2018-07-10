import { Module } from '@nestjs/common';

import { SearchService } from '.';

@Module({
    providers: [
        SearchService
    ],
    exports: [
        SearchService
    ]
})
/**
 * The SearchModule, which bundles all
 * operational or processable searche related
 * modules, controllers and components
 */
export class SearchModule { }
