import sqlts, { Config } from '@rmp135/sql-ts';
import { LoggerService } from '@/core';

const config: Config = {
    client: 'pg',
    connection: {
        host: 'localhost',
        user: 'nest-mud-user',
        password: 'nest-mud-pass',
        database: 'nest-mud',
    },
    // "template": "sql-ts.template.hbs",
    // "folder": "src/core/repository",
    // "filename": "tables.generated",
    interfaceNameFormat: '${table}',
    tableNameCasing: 'pascal',
    excludedTables: ['public.migrations'],
};

const loggerService = new LoggerService();

class Main {
    static async run() {
        const logger = loggerService.logger({
            function: 'run',
        });

        logger.info('Getting definitions');

        const definitions = await sqlts.toObject(config);

        if (!definitions.tables) {
            logger.info('No tables available, breaking..');
            return;
        }

        definitions.tables.forEach((definition) => {
            logger.info(definition);
        });
    }
}

Main.run();
