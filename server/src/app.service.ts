import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
    static content(): string {
        return 'Nest M.U.D - API';
    }
}
