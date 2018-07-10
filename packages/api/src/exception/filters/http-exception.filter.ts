import { ExceptionFilter, Catch, Logger, ArgumentsHost } from '@nestjs/common';
import { HttpException } from '@nestjs/common';
import { LogService } from '../../log/log.service';

@Catch(HttpException)
/**
 * The HTTPExceptionFilter catches
 * all Exceptions and responds with a
 * HTTP status and returns
 * a JSON obejct with the exception message.
 */
export class HttpExceptionFilter implements ExceptionFilter {
  private logger: Logger;
  constructor() {
    this.logger = new Logger('HttpException');
   }
  /**
   * Catches exceptions, thrown from the Appliaction
   * and responds accordingly
   * @param exception The exception which is thrown
   * @param response The response object from Express
   */
  catch(exception: HttpException, host: ArgumentsHost) {
    const status = exception.getStatus();

    this.logger.error(`Exception thrown: ${JSON.stringify(exception.getResponse())}`);
    const response = host.switchToHttp().getResponse();
    response
      .status(status)
      .json({
        statusCode: status,
        message: exception.getResponse(),
      });
  }
}
