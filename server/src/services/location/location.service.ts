import { Injectable } from '@nestjs/common';

// Application
import { Location } from '@/interfaces/location.interface';

@Injectable()
export class LocationService {
    getMany(): Location[] {
        return null;
    }
}
