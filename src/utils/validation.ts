import { ValidationException } from './exceptions/validation-exception';
import { ValidationArguments, ValidationError } from 'class-validator';

type ValidationRuleFieldMap<T> = Partial<Record<keyof T, ValidationErrorRule[]>>;

type ValidationErrorRule =
  | ['arrayNotEmpty']
  | ['domain', string]
  | ['invalidId', string, string]
  | ['isArray']
  | ['isBoolean']
  | ['isInt']
  | ['isISO8601']
  | ['isNotEmpty']
  | ['length', string, string]
  | ['max', string]
  | ['maxDate', string]
  | ['maxLength', string]
  | ['min', string]
  | ['minDate', string]
  | ['minLength', string];

const VALIDATION_ERROR_CODE = {
  arrayNotEmpty: 'arrayNotEmpty',
  domain: 'domain',
  invalidId: 'invalidId',
  isArray: 'isArray',
  isBoolean: 'isBoolean',
  isInt: 'isInt',
  isISO8601: 'isISO8601',
  isNotEmpty: 'isNotEmpty',
  length: 'length',
  max: 'max',
  maxDate: 'maxDate',
  maxLength: 'maxLength',
  min: 'min',
  minDate: 'minDate',
  minLength: 'minLength',
} as const;
type ValidationCodeEnum = keyof typeof VALIDATION_ERROR_CODE;

/* eslint-disable @typescript-eslint/restrict-template-expressions */
const validationMessageFactory: Record<
  ValidationCodeEnum,
  (validationArguments: ValidationArguments) => string
> = {
  arrayNotEmpty: () => 'arrayNotEmpty',
  domain: () => 'domain',
  invalidId: () => 'invalidId',
  isArray: () => 'isArray',
  isBoolean: () => 'isBoolean',
  isInt: () => 'isInt',
  isISO8601: () => 'isISO8601',
  isNotEmpty: () => 'isNotEmpty',
  length: (args) => `length;${args.constraints[0]};${args.constraints[1]}`,
  max: (args) => `max;${args.constraints[0]}`,
  maxDate: (args) => `maxDate;${args.constraints[0]}`,
  maxLength: (args) => `maxLength;${args.constraints[0]}`,
  min: (args) => `min;${args.constraints[0]}`,
  minDate: (args) => `minDate;${args.constraints[0]}`,
  minLength: (args) => `minLength;${args.constraints[0]}`,
};
/* eslint-enable @typescript-eslint/restrict-template-expressions */

function validationExceptionFactory(validationErrors: ValidationError[]) {
  const result: Record<string, ValidationErrorRule[]> = {};

  function processErrors(errors: ValidationError[], fieldPath = '') {
    errors.forEach((error) => {
      const fieldName = fieldPath ? `${fieldPath}.${error.property}` : error.property;

      if (error.constraints !== undefined) {
        const fieldErrors: ValidationErrorRule[] = [];
        Object.values(error.constraints).forEach((valString) => {
          fieldErrors.push(valString.split(';') as ValidationErrorRule);
        });

        if (result[fieldName] !== undefined) {
          result[fieldName].push(...fieldErrors);
        } else {
          result[fieldName] = fieldErrors;
        }
      }

      if (error.children && error.children.length > 0) {
        processErrors(error.children, fieldName);
      }
    });
  }

  processErrors(validationErrors);

  return new ValidationException(result);
}

export { VALIDATION_ERROR_CODE, validationExceptionFactory, validationMessageFactory };
export type { ValidationCodeEnum, ValidationErrorRule, ValidationRuleFieldMap };
