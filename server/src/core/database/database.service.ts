import { Injectable, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool, PoolClient, Client } from 'pg';
import { v4 as uuidv4 } from 'uuid';

// Application
import { LoggerService, Logger } from '@/core/logger/logger.service';

// Global
let pool: Pool;

// Add to ConfigService whether pooled connections are enabled or not
// and internally manage whether connect returns a PoolClient or Client..
// ...

@Injectable({ scope: Scope.REQUEST })
export class DatabaseService {
    private _pooledClient: PoolClient;
    private _client: Client;
    private _instanceID: string;
    private logger: Logger;

    constructor(private configService: ConfigService, loggerService: LoggerService) {
        this._instanceID = uuidv4();
        this.logger = loggerService.logger({ class: DatabaseService.name });
        this.logger.debug(`Instance ${this._instanceID}`);
    }

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

    get client() {
        if (!this._client) {
            this.logger.debug(`client - ${this._instanceID} - ${this._client} - not defined`);
            throw new Error('Not connected, cannot return client');
        }
        return this._client;
    }

    get pooledClient() {
        if (!this._pooledClient) {
            this.logger.debug(`pooledClient - ${this._instanceID} - not defined`);
            throw new Error('Not connected, cannot return pooled client');
        }
        return this._pooledClient;
    }

    async pooledConnect(): Promise<PoolClient> {
        DatabaseService.poolBegin(this.configService);
        if (this._pooledClient == null) {
            this._pooledClient = await pool.connect();
            await this._pooledClient.query('BEGIN');
        }
        return this._pooledClient;
    }

    async pooledEnd(commit?: boolean): Promise<void> {
        if (this._pooledClient != null) {
            if (commit) {
                await this._pooledClient.query('COMMIT');
            } else {
                await this._pooledClient.query('ROLLBACK');
            }
            this._pooledClient.release();
            this._pooledClient = null;
        }
        return null;
    }

    async connect(): Promise<Client> {
        if (this._client != null) {
            this.logger.debug(`connect - ${this._instanceID} - client defined, returning client`);
            return this._client;
        }

        this.logger.debug(`connect - ${this._instanceID} - connecting new client`);

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
        await client.query('BEGIN');
        this._client = client;
        return this._client;
    }

    async end(commit?: boolean): Promise<void> {
        if (this._client != null) {
            if (commit) {
                this.logger.debug(`end - ${this._instanceID} - disconnecting with commit`);
                await this._client.query('COMMIT');
            } else {
                this.logger.debug(`end - ${this._instanceID} - disconnecting with rollback`);
                await this._client.query('ROLLBACK');
            }
            await this._client.end();
            this._client = null;
        }
        return null;
    }
}
