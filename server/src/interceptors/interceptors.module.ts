/* istanbul ignore file */
import { Module, Scope } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

// Application
import { LoggerModule, DatabaseModule } from '@/core';
import { TransactionInterceptor } from './transaction/transaction.interceptor';
import { LoggingInterceptor } from './logging/logging.interceptor';

@Module({
    imports: [LoggerModule, DatabaseModule],
    providers: [
        {
            provide: APP_INTERCEPTOR,
            scope: Scope.REQUEST,
            useClass: TransactionInterceptor,
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: LoggingInterceptor,
        },
    ],
})
export class InterceptorsModule {}
