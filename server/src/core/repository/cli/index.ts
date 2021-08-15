import * as fs from 'fs';
import * as path from 'path';

import Handlebars from 'handlebars';
import sqlts, { Config } from '@rmp135/sql-ts';
import { LoggerService } from '@/core';
import { DecoratedDatabase } from '@rmp135/sql-ts/dist/Typings';

const config: Config = {
    client: 'pg',
    connection: {
        host: 'localhost',
        user: 'nest-mud-user',
        password: 'nest-mud-pass',
        database: 'nest-mud',
    },
    template:
        path.resolve(__dirname, '') +
        '/repository.handlebars'.replace('dist', 'src'),
    interfaceNameFormat: '${table}',
    tableNameCasing: 'pascal',
    excludedTables: ['public.migrations'],
};

const loggerService = new LoggerService();

class Main {
    async run() {
        const logger = loggerService.logger({
            function: 'run',
        });

        logger.info('Loading test file template');
        const testFileTemplate = this.loadSpecTemplate();

        logger.info('Getting all definitions');

        const definitions = await sqlts.toObject(config);
        if (!definitions.tables) {
            logger.info('No tables available, breaking..');
            return;
        }

        for (var idx = 0; idx < definitions.tables.length; idx++) {
            const tableName = definitions.tables[idx].name;
            logger.info(`Processing repository ${tableName}`);

            // Recreate config with single table so we can generate individual
            // source for each repository
            const tableConfig: Config = JSON.parse(JSON.stringify(config));
            tableConfig.tables = [`public.${tableName}`];
            const tableDefinitions = await sqlts.toObject(tableConfig);

            // Generate repository source
            const output = sqlts.fromObject(tableDefinitions, tableConfig);

            const fileName = `${tableName}.repository.ts`;
            const directory = `src/repositories/${tableName}`;
            if (!fs.existsSync(directory)) {
                fs.mkdirSync(directory);
            }
            const outFile = path.join(directory, fileName);

            logger.info(`Writing ${outFile}`);
            fs.writeFileSync(outFile, output);

            // Generate repository spec source
            this.writeSpecSource(testFileTemplate, tableName, tableDefinitions);
        }
    }

    loadSpecTemplate(): string {
        var content = fs.readFileSync(
            __dirname + '/repository.spec.handlebars',
        );
        return content.toString();
    }

    writeSpecSource(
        template: string,
        tableName: string,
        tableDefinitions: DecoratedDatabase,
    ): void {
        const logger = loggerService.logger({
            function: 'generateTestSource',
        });

        var compiledTemplate = Handlebars.compile(template);
        var result = compiledTemplate(tableDefinitions);

        const fileName = `${tableName}.repository.spec.ts`;
        const directory = `src/repositories/${tableName}`;
        const outFile = path.join(directory, fileName);

        logger.info(`Writing spec ${outFile}`);
        fs.writeFileSync(outFile, result);
    }
}

new Main().run();
