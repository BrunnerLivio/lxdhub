import 'rxjs/add/operator/map';

import { NestInterceptor, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs/Observable';

import { ImageListItemDto } from '..';
import { PaginationResponseDto } from '../../common';

@Injectable()
/**
 * Represents the inteceptor, which sets the URL attributes of the _links
 * object of the ImageListItemDtos
 */
export class ImageListItemInterceptor implements NestInterceptor {
    /**
     * Intercepts the response of, by updating the _links object with
     * the appropiate urls.
     * @param req The express request object
     * @param stream$ The response stream
     */
    // @ts-ignore
    intercept(
        _,
        call$: Observable<PaginationResponseDto<ImageListItemDto[]>>)
        : Observable<PaginationResponseDto<ImageListItemDto[]>> {
        // Get url e.g. http://localhost:3000/api/v1/image
        // without any GET-Parameters (?remoteId=1)
        // const url = `${req.protocol}://${req.get('host')}${req.baseUrl}`;
        const url = 'test';

        // Returns the response stream and maps the data
        return call$.map(response => {
            // Updates each image _links object
            response.results.forEach(image =>
                image._links = {
                    // Set the detail url
                    detail: `${url}/${image.id}`
                });
            return response;
        });
    }
}
