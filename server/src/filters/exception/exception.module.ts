/* istanbul ignore file */
import { Module, Scope } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

// Application
import { LoggerModule } from '@/core';
import { CustomExceptionFilter } from './exception.filter';

@Module({
    imports: [LoggerModule],
    providers: [
        {
            provide: APP_FILTER,
            scope: Scope.REQUEST,
            useClass: CustomExceptionFilter,
        },
    ],
})
export class CustomExceptionFilterModule {}
