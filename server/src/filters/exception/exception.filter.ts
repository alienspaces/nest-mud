import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

// Application
import { LoggerService, Logger } from '@/core';

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
    private logger: Logger;

    constructor(loggerService: LoggerService) {
        this.logger = loggerService.logger({ class: CustomExceptionFilter.name });
    }

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

        this.logger.warn(`Handling ${exception} here...`);

        // TODO: Catch database errors at the repository level and throw as DatabaseError type so
        // the exception can be translated here into a HttpException..

        response.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
        });
    }
}
