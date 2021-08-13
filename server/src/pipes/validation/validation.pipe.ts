import {
    ArgumentMetadata,
    Injectable,
    PipeTransform,
    BadRequestException,
} from '@nestjs/common';

// TODO: Assess https://ajv.js.org/guide/managing-schemas.html
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
const ajv = new Ajv();
addFormats(ajv);

@Injectable()
export class ValidationPipe implements PipeTransform {
    constructor(private schemaId: string, private schema: any) {}
    transform(value: any, metadata: ArgumentMetadata) {
        console.log(`Value`, value);
        console.log(`Schema ${this.schemaId}`);
        console.log(`Meta`, metadata);

        let validate = ajv.getSchema(this.schemaId);
        if (!validate) {
            console.log('Adding schema', this.schema);
            ajv.addSchema(this.schema, this.schemaId);
            validate = ajv.getSchema(this.schemaId)!;
        }

        if (!validate(value)) {
            // TODO: Consistent definition and handling of errors
            console.error('Failed validation', validate.errors);
            throw new BadRequestException('Validation failed');
        }

        return value;
    }
}
