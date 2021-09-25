import { Injectable, Scope } from '@nestjs/common';
import P from 'pino';
import pino from 'pino';

export type Logger = P.Logger;

@Injectable({ scope: Scope.REQUEST })
export class LoggerService {
    private _logger: pino.Logger;
    constructor() {
        this._logger = pino({
            level: process.env.APP_SERVER_LOG_LEVEL || 'info',
        });
    }

    logger(context: { correlation?: string; class?: string; function?: string }): pino.Logger {
        if (context) {
            return this._logger.child(context);
        }
        return this._logger;
    }
}
