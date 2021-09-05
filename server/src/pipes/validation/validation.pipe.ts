import { ArgumentMetadata, Injectable, PipeTransform, BadRequestException } from '@nestjs/common';

// Application
import { Schema } from '@/core/schema/schema';
import { validationError } from '@/common/error';

@Injectable()
export class ValidationPipe implements PipeTransform {
    constructor(private schemaId: string, private schema: any) {}
    transform(value: any, metadata: ArgumentMetadata) {
        if (metadata.type === 'param') {
            return value;
        }

        const errors = Schema.validate(this.schemaId, this.schema, value);
        if (errors) {
            let validationErrors: string = '';
            errors.forEach((error) => {
                validationErrors += `${error.instancePath} ${error.data}, `;
            });
            validationErrors = validationErrors.substring(0, validationErrors.length - 2);

            throw validationError(`Validation failed: ${validationErrors}`);
        }

        return value;
    }
}
