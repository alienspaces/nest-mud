import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Scope } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

// Application
import { LoggerService, Logger, DatabaseService } from '@/core';

@Injectable({ scope: Scope.REQUEST })
export class TransactionInterceptor implements NestInterceptor {
    private logger: Logger;

    constructor(private databaseService: DatabaseService, loggerService: LoggerService) {
        this.logger = loggerService.logger({ class: TransactionInterceptor.name });
    }

    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        this.logger.debug('Starting database transaction');

        // Establish client connection
        await this.databaseService.connect();

        return next.handle().pipe(
            tap({
                next: async () => {
                    // Commit or rollback
                    const { statusCode } = context.switchToHttp().getResponse();
                    const commit = statusCode < 400;
                    this.logger.debug(`Commit database transaction >${commit}<`);
                    await this.databaseService.end(commit);
                },
                error: async (e) => {
                    // Rollback
                    this.logger.warn(`Rolling back database transaction >${e}<`);
                    try {
                        await this.databaseService.end(false);
                    } catch (e) {
                        this.logger.error('Failed to rollback transaction', e);
                    }
                },
            }),
        );
    }
}
