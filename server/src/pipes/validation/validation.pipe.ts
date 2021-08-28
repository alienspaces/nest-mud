import { ArgumentMetadata, Injectable, PipeTransform, BadRequestException } from '@nestjs/common';

import { Schema } from '@/core/schema/schema';

@Injectable()
export class ValidationPipe implements PipeTransform {
    constructor(private schemaId: string, private schema: any) {}
    transform(value: any, metadata: ArgumentMetadata) {
        console.log(`Value`, value);
        console.log(`Schema ${this.schemaId}`);
        console.log(`Meta`, metadata);

        const errors = Schema.validate(this.schemaId, this.schema, value);
        if (errors) {
            // TODO: Consistent definition and handling of errors
            console.error('Failed validation', errors);
            throw new BadRequestException('Validation failed');
        }

        return value;
    }
}
