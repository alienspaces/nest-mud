import { Injectable, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Pool, PoolClient } from 'pg';

// Global
let pool: Pool;

@Injectable({ scope: Scope.REQUEST })
export class DatabaseService {
    private client: PoolClient;

    constructor(private configService: ConfigService) {}

    static poolBegin(config: ConfigService) {
        if (pool != null) {
            return;
        }
        const dbUser = config.get<string>('APP_SERVER_DB_USER');
        const dbPassword = config.get<string>('APP_SERVER_DB_PASSWORD');
        const dbHost = config.get<string>('APP_SERVER_DB_HOST');
        const dbName = config.get<string>('APP_SERVER_DB_NAME');
        const dbPort = config.get<string>('APP_SERVER_DB_PORT');
        pool = new Pool({
            user: dbUser,
            password: dbPassword,
            host: dbHost,
            database: dbName,
            port: parseInt(dbPort),
        });
    }

    static async poolEnd() {
        if (pool == null) {
            return;
        }
        await pool.end();
    }

    async connect(): Promise<PoolClient> {
        DatabaseService.poolBegin(this.configService);
        if (this.client == null) {
            this.client = await pool.connect();
        }
        return this.client;
    }

    release(): any {
        if (this.client != null) {
            return this.client.release();
        }
        return null;
    }
}
