import { Injectable } from '@nestjs/common';

// Application
import { Location } from '@/interfaces/location.interface';

@Injectable()
export class LocationsService {
    getMany(): Location[] {
        return null;
    }
}
