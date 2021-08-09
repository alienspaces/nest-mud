import { Injectable, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Pool, PoolClient, Client } from 'pg';

// Global
let pool: Pool;

// TODO: Add to ConfigService whether pooled connections are enabled or not
// and internally manage whether connect returns a PoolClient or Client..

// TODO: Add commit and rollback functionality

@Injectable({ scope: Scope.REQUEST })
export class DatabaseService {
    private pooledClient: PoolClient;
    private client: Client;

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

    async pooledConnection(): Promise<PoolClient> {
        DatabaseService.poolBegin(this.configService);
        if (this.pooledClient == null) {
            this.pooledClient = await pool.connect();
        }
        return this.pooledClient;
    }

    releasePooled(): any {
        if (this.pooledClient != null) {
            this.pooledClient.release();
            this.pooledClient = null;
        }
        return null;
    }

    async connect(): Promise<Client> {
        if (this.client != null) {
            return this.client;
        }

        const config = this.configService;
        const dbUser = config.get<string>('APP_SERVER_DB_USER');
        const dbPassword = config.get<string>('APP_SERVER_DB_PASSWORD');
        const dbHost = config.get<string>('APP_SERVER_DB_HOST');
        const dbName = config.get<string>('APP_SERVER_DB_NAME');
        const dbPort = config.get<string>('APP_SERVER_DB_PORT');

        const client = new Client({
            user: dbUser,
            password: dbPassword,
            host: dbHost,
            database: dbName,
            port: parseInt(dbPort),
        });
        await client.connect();
        this.client = client;
        return this.client;
    }

    async end(): Promise<void> {
        if (this.client != null) {
            await this.client.end();
            this.client = null;
        }
        return null;
    }
}
