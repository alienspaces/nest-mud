import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

// Application
import { LoggerService, Logger, RepositoryError, DomainError } from '@/core';

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
        let status: number;
        let message: string;
        if (exception instanceof HttpException) {
            status = exception.getStatus();
            message = exception.message;
        } else if (exception instanceof RepositoryError) {
            // Repository errors means we aren't catching the
            // error correctly in the domain layer.
            status = HttpStatus.I_AM_A_TEAPOT;
            message = exception.message;
        } else if (exception instanceof DomainError) {
            // Domain errors are Repository errors that have
            // been caught in the domain layer or raised by
            // a domain service explicitly.
            status = HttpStatus.BAD_REQUEST;
            message = exception.message;
        } else {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
        }
        this.logger.warn(`Handling ${exception} here...`);

        response.status(status).json({
            statusCode: status,
            message: message,
            timestamp: new Date().toISOString(),
            path: request.url,
        });
    }
}
