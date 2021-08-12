export class LocationDto {
    id: string;
    name: string;
    description: string;
    default: boolean;
    north_location_id?: string;
    northeast_location_id?: string;
    east_location_id?: string;
    southeast_location_id?: string;
    south_location_id?: string;
    southwest_location_id?: string;
    west_location_id?: string;
    northwest_location_id?: string;
    up_location_id?: string;
    down_location_id?: string;
    created_at: Date;
    updated_at?: Date;
}
