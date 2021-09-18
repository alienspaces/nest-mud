import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Scope } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

// Application
import { LoggerService, Logger } from '@/core';

@Injectable({ scope: Scope.REQUEST })
export class LoggingInterceptor implements NestInterceptor {
    private logger: Logger;

    constructor(loggerService: LoggerService) {
        this.logger = loggerService.logger({ class: LoggingInterceptor.name });
    }

    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        const now = Date.now();
        return next.handle().pipe(
            tap({
                next: async () => {
                    this.logger.warn(
                        `${context.getClass().name} - ${context.getHandler().name} - time >${Date.now() - now}ms<`,
                    );
                },
                error: async (e) => {
                    this.logger.warn(
                        `${context.getClass().name} - ${context.getHandler().name} - time >${
                            Date.now() - now
                        }ms< - error >${e}<`,
                    );
                },
            }),
        );
    }
}
