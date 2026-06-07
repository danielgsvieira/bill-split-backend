import { ValidationException } from 'src/utils/exceptions/validation-exception';
import { ValidationErrorRule, ValidationRuleFieldMap } from 'src/utils/validation';

abstract class BaseValidator<Entity, Dto, User> {
  abstract validateView(entity: Entity, user: User): void | Promise<void>;

  abstract filterView(entities: Entity[], user: User): Entity[] | Promise<Entity[]>;

  abstract validateCreate(dto: Dto, user: User, aditionalData: unknown): void | Promise<void>;

  abstract validateUpdate(dto: Dto, entity: Entity, user: User): void | Promise<void>;

  abstract validateDelete(entity: Entity, user: User): void | Promise<void>;

  protected validOrThrow<T>(errors: ValidationRuleFieldMap<T>) {
    const keys = Object.keys(errors) as (keyof T)[];

    const invalidFields: [keyof T, ValidationErrorRule[]][] = [];

    keys.forEach((key) => {
      const errorsForKey = errors[key];

      if (errorsForKey !== undefined && errorsForKey.length > 0) {
        invalidFields.push([key, errorsForKey]);
      }
    });

    if (invalidFields.length > 0) {
      const errorsObj = invalidFields.reduce(
        (acc, [field, fieldErrors]) => {
          acc[field] = fieldErrors;
          return acc;
        },
        {} as Record<keyof T, ValidationErrorRule[]>,
      );

      throw new ValidationException(errorsObj);
    }
  }
}

export { BaseValidator };
