import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

import { CloneImageDto, CloneImageResponseDto, ImageDetailDto, ImageListItemDto, ImageListOptions } from '.';
import { PaginationResponseDto, ResponseDto } from '../common';
import { ImageService } from './image.service';
import { ImageListItemInterceptor } from './interceptors/image-list-item.interceptor';

/**
 * The Image Controller, which is the API
 * interface for Image-Operations.
 */
@Controller('image')
export class ImageController {
  constructor(
    private readonly imageService: ImageService
  ) { }

  /**
   * Returns images, limited by the given pagination options and
   * filters it by the given remoteId.
   * If remoteId is not given, it takes the first remote.
   * @param options The options to paginate through the requested data
   */
  @Get('/')
  @UseInterceptors(ImageListItemInterceptor)
  @ApiResponse({ status: 200, description: 'The images have been successfully requested' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async findByRemote(
    @Query(new ValidationPipe({ transform: true }))
    options: ImageListOptions
  ): Promise<PaginationResponseDto<ImageListItemDto[]>> {
    try {
      // Fetches the images
      return await this.imageService
        .findByRemote(options.remoteId, options, options.query ? options.query.trim() : null);
    }
    catch (err) {
      if (err instanceof TypeError) {
        // Is a search error
        throw new BadRequestException(err.message);
      } else {
        // Unknwon error. Should not occur
        throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  /**
   * Returns a detail image with the given id
   * @param {number} id The id of the image
   */
  @Get('/:id')
  @ApiResponse({ status: 200, description: 'The image have been successfully requested' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async findOne(
    // Convert id to an integer
    @Param('id', new ParseIntPipe())
    id: number
  ): Promise<ResponseDto<ImageDetailDto>> {
    return await this.imageService.findOne(id);
  }

  /**
   * Clones the image with the given id
   * @param {number} id The id of the image
   */
  @Post('/:id/clone')
  @ApiResponse({ status: 200, description: 'The image have been successfully cloned' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 403, description: 'Not Authorized' })
  async clone(
    // Convert id to an integer
    @Param('id', new ParseIntPipe())
    id: number,
    @Body()
    cloneImageDto: CloneImageDto
  )
    : Promise<ResponseDto<CloneImageResponseDto>> {
    return await this.imageService.cloneImage(id, cloneImageDto);
  }
}
