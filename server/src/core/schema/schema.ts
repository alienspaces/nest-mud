// Assess https://ajv.js.org/guide/managing-schemas.html
import Ajv, { ErrorObject } from 'ajv';
import addFormats from 'ajv-formats';
const ajv = new Ajv();
addFormats(ajv);

export class Schema {
    static validate(schemaId: string, schema: any, value: any): null | ErrorObject[] {
        let validate = ajv.getSchema(schemaId);
        if (!validate) {
            ajv.addSchema(schema, schemaId);
            validate = ajv.getSchema(schemaId)!;
        }
        if (!validate(value)) {
            return validate.errors;
        }
        return null;
    }
}
