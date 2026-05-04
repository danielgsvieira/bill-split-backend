import { ValidationErrorRule } from '../validation';
import { BadRequestException, HttpStatus } from '@nestjs/common';

class ValidationException extends BadRequestException {
  constructor(validationErrors: Record<string, ValidationErrorRule[]>) {
    super({
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Validation error',
      validationErrors,
    });
  }
}

export { ValidationException };
