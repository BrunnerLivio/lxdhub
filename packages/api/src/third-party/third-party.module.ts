import { Global, Module } from '@nestjs/common';

import { FsProvider, PathProvider, RequestProvider } from '.';

@Module({
    providers: [
        FsProvider,
        PathProvider,
        RequestProvider
    ],
    exports: [
        FsProvider,
        PathProvider,
        RequestProvider
    ]
})
@Global()
export class ThirdPartyModule { }
