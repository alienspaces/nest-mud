import { Controller, Get } from '@nestjs/common';
import { AppModule } from './app.module';
import { AppService } from './app.service';

@Controller()
export class AppController {
    @Get()
    get(): string {
        return AppService.content();
    }
}
