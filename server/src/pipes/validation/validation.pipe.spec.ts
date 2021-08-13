import { ValidationPipe } from './validation.pipe';

describe('ValidationPipe', () => {
    it('should be defined', () => {
        const schema = {
            $schema: 'http://json-schema.org/draft-07/schema#',
            $id: 'http://trevipay.com/customer-api/v2/create-card.schema.json',
            title: 'Create Card V2',
            type: 'object',
            properties: {
                id: {
                    type: 'string',
                    format: 'uuid',
                },
            },
            required: ['id'],
            additionalProperties: false,
        };

        expect(new ValidationPipe(schema.$id, schema)).toBeDefined();
    });
});
