import { Controller } from '@nestjs/common';

// Application
import { LocationsService} from '@/services/locations/locations.service';

@Controller('/api/v1/locations')
export class LocationsController {
    constructor(private locationsService: LocationsService ){}
}
