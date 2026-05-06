import { ValidationException } from './exceptions/validation-exception';
import { ValidationArguments, ValidationError } from 'class-validator';

type ValidationRuleFieldMap<T> = Partial<Record<keyof T, ValidationErrorRule[]>>;

type ValidationErrorRule =
  | ['required']
  | ['length', string, string]
  | ['maxLength', string]
  | ['minLength', string]
  | ['alreadyExists']
  | ['isArray']
  | ['isInt']
  | ['isDate']
  | ['minDate', string]
  | ['maxDate', string]
  | ['invalidId', string, string]
  | ['domain', string];

const VALIDATION_ERROR_CODE = {
  isNotEmpty: 'isNotEmpty',
  length: 'length',
  maxLength: 'maxLength',
  minLength: 'minLength',
  isArray: 'isArray',
  isInt: 'isInt',
  isDate: 'isDate',
  minDate: 'minDate',
  maxDate: 'maxDate',
  invalidId: 'invalidId',
  domain: 'domain',
} as const;
type ValidationCodeEnum = keyof typeof VALIDATION_ERROR_CODE;

const validationMessageFactory: Record<
  ValidationCodeEnum,
  (validationArguments: ValidationArguments) => string
> = {
  isNotEmpty: () => 'required',
  length: (args) => `length;${args.constraints[0]};${args.constraints[1]}`,
  maxLength: (args) => `maxLength;${args.constraints[0]}`,
  minLength: (args) => `minLength;${args.constraints[0]}`,
  isArray: () => 'isArray',
  isInt: () => 'isInt',
  isDate: () => 'isDate',
  minDate: (args) => `minDate;${args.constraints[0]}`,
  maxDate: (args) => `maxDate;${args.constraints[0]}`,
  invalidId: () => 'invalidId',
  domain: () => 'domain',
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
