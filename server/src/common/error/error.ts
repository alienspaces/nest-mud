import { BadRequestException, HttpException } from '@nestjs/common';

export function validationError(error: string): HttpException {
    return new BadRequestException(error);
}

export function domainServiceError(error: string): HttpException {
    return new BadRequestException(error);
}
