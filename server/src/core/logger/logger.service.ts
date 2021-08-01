import { Injectable, Scope } from '@nestjs/common';
import pino from 'pino';

@Injectable({ scope: Scope.REQUEST })
export class LoggerService {
    private _logger: pino.Logger;
    constructor() {
        this._logger = pino({
            level: process.env.APP_LOG_LEVEL || 'info',
        });
    }

    logger(context: {
        correlation?: string;
        class?: string;
        function?: string;
    }): pino.Logger {
        if (context) {
            this._logger = this._logger.child(context);
        }
        return this._logger;
    }
}
