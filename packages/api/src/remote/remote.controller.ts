import { Controller, Get } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

import { RemoteService } from './remote.service';
import { ResponseDto } from '../common';
import { RemoteDto } from './dtos';

/**
 * The Remote-Controller, which is the API
 * interface for Remote-Operations.
 */
@Controller('remote')
export class RemoteController {
  constructor(
    private readonly remoteService: RemoteService
  ) { }

  /**
   * Returns all remotes
   */
  @Get('/')
  @ApiResponse({
    type: ResponseDto,
    status: 200
  })
  async findAll(): Promise<ResponseDto<RemoteDto[]>> {
    return await this.remoteService.findAll();
  }
}
