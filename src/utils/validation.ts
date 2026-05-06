import { ValidationException } from './exceptions/validation-exception';
import { ValidationArguments, ValidationError } from 'class-validator';

type ValidationRuleFieldMap<T> = Partial<Record<keyof T, ValidationErrorRule[]>>;

type ValidationErrorRule =
  | ['arrayNotEmpty']
  | ['domain', string]
  | ['invalidId', string, string]
  | ['isArray']
  | ['isBoolean']
  | ['isDate']
  | ['isInt']
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
  isDate: 'isDate',
  isInt: 'isInt',
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

const validationMessageFactory: Record<
  ValidationCodeEnum,
  (validationArguments: ValidationArguments) => string
> = {
  arrayNotEmpty: () => 'arrayNotEmpty',
  domain: () => 'domain',
  invalidId: () => 'invalidId',
  isArray: () => 'isArray',
  isBoolean: () => 'isBoolean',
  isDate: () => 'isDate',
  isInt: () => 'isInt',
  isNotEmpty: () => 'isNotEmpty',
  length: (args) => `length;${args.constraints[0]};${args.constraints[1]}`,
  max: (args) => `max;${args.constraints[0]}`,
  maxDate: (args) => `maxDate;${args.constraints[0]}`,
  maxLength: (args) => `maxLength;${args.constraints[0]}`,
  min: (args) => `min;${args.constraints[0]}`,
  minDate: (args) => `minDate;${args.constraints[0]}`,
  minLength: (args) => `minLength;${args.constraints[0]}`,
};

function validationExceptionFactory(validationErrors: ValidationError[]) {
  const result: Record<string, ValidationErrorRule[]> = {};

  validationErrors.forEach((error) => {
    const fieldName = error.property;

    const fieldErrors: ValidationErrorRule[] = [];
    Object.values(error.constraints ?? {}).forEach((valString) => {
      fieldErrors.push(valString.split(';') as ValidationErrorRule);
    });

    result[fieldName] = fieldErrors;
  });

  return new ValidationException(result);
}

export { VALIDATION_ERROR_CODE, validationExceptionFactory, validationMessageFactory };
export type { ValidationCodeEnum, ValidationErrorRule, ValidationRuleFieldMap };
