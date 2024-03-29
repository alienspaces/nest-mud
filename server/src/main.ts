import { NestFactory } from '@nestjs/core';

// Application
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        cors: true,
        logger: ['log', 'error', 'warn', 'debug', 'verbose'],
    });
    await app.listen(3000);
}
bootstrap();
