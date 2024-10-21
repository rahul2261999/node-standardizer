import {
  ArrayValidationRules,
  BooleanValidationRules,
  NumberValidationRules,
  ObjectValidationRules,
  StringValidationRules,
  ValidatorFunction,
  ValidatorResponse
} from "./validator.interface";


class Validation implements ValidatorFunction {
  public validateBoolean(param: boolean, validatorRules: BooleanValidationRules): ValidatorResponse {

    if(validatorRules.required && param === undefined) {
      return {
        isValid: false,
        message: validatorRules.errorMessage || 'param is required.'
      };
    }

    if(validatorRules.value !== param) {
      return {
        isValid: false,
        message: validatorRules.errorMessage || 'param value did not matched the provided value.'
      };
    }

    if(validatorRules.customValidator !== undefined && !validatorRules.customValidator()) {
      return {
        isValid: false,
        message: validatorRules.errorMessage || 'Custom validator failed.'
      }
    }

    return {
      isValid: true,
      message: null
    };
  }
  public validateString(param: string, validatorRules: StringValidationRules): ValidatorResponse {
    // Check if the param is required and if it's present
    if (validatorRules.required && param === undefined) {
      return {
        isValid: false,
        message: validatorRules.errorMessage || 'param is required.'
      };
    }

    // Check if null is allowed
    if (param === null && validatorRules.nullAllowed !== undefined && !validatorRules.nullAllowed) {
      return {
        isValid: false,
        message: validatorRules.errorMessage || 'Null is not allowed.'
      };
    }

    // Check minLength rule
    if (validatorRules.minLength !== undefined && param.length < validatorRules.minLength) {
      return {
        isValid: false,
        message: validatorRules.errorMessage || `param must be at least ${validatorRules.minLength} characters long.`
      };
    }

    // Check maxLength rule
    if (validatorRules.maxLength !== undefined && param.length > validatorRules.maxLength) {
      return {
        isValid: false,
        message: validatorRules.errorMessage || `param must be no more than ${validatorRules.maxLength} characters long.`
      };
    }

    // Check pattern (RegExp) rule
    if (validatorRules.pattern && !validatorRules.pattern.test(param)) {
      return {
        isValid: false,
        message: validatorRules.errorMessage || 'param does not match the required pattern.'
      };
    }

    // Check customValidator if provided
    if (validatorRules.customValidator && !validatorRules.customValidator(param)) {
      return {
        isValid: false,
        message: validatorRules.errorMessage || 'param failed custom validation.'
      };
    }

    // If all checks pass, the param is valid
    return {
      isValid: true,
      message: null
    };
  }

  public validateNumber(param: number, validatorRules: NumberValidationRules): ValidatorResponse {
    // Check if the param is required and if it's present
    if (validatorRules.required && param === undefined) {
      return {
        isValid: false,
        message: validatorRules.errorMessage || 'param is required.'
      };
    }

    // Check if null is allowed
    if (param === null && validatorRules.nullAllowed !== undefined && !validatorRules.nullAllowed) {
      return {
        isValid: false,
        message: validatorRules.errorMessage || 'Null is not allowed.'
      };
    }

    // Check min rule
    if (validatorRules.min !== undefined && param < validatorRules.min) {
      return {
        isValid: false,
        message: validatorRules.errorMessage || `param must be greater than or equal to ${validatorRules.min}.`
      };
    }

    // Check max rule
    if (validatorRules.max !== undefined && param > validatorRules.max) {
      return {
        isValid: false,
        message: validatorRules.errorMessage || `param must be less than or equal to ${validatorRules.max}.`
      };
    }

    // Check pattern (RegExp) rule if pattern is applicable (optional)
    // While regular expressions are not typically used for numbers, this option allows for special cases
    if (validatorRules.pattern && !validatorRules.pattern.test(param.toString())) {
      return {
        isValid: false,
        message: validatorRules.errorMessage || 'param does not match the required pattern.'
      };
    }

    // Check customValidator if provided
    if (validatorRules.customValidator && !validatorRules.customValidator(param)) {
      return {
        isValid: false,
        message: validatorRules.errorMessage || 'param failed custom validation.'
      };
    }

    // If all checks pass, the param is valid
    return {
      isValid: true,
      message: null
    };
  }
  public validateObject<T>(params: T, validatorRules: ObjectValidationRules<T>): ValidatorResponse {
    if (validatorRules.required && (params === undefined)) {
      return {
        isValid: false,
        message: validatorRules.errorMessage || 'Object is required.'
      };
    }

    if (params === null && validatorRules.nullAllowed !== undefined && !validatorRules.nullAllowed) {
      return {
        isValid: false,
        message: validatorRules.errorMessage || 'Null is not allowed.'
      };
    }

    if (validatorRules.pattern) {
      const stringifiedObject = JSON.stringify(params); // Convert object to string representation for pattern matching
      if (!validatorRules.pattern.test(stringifiedObject)) {
        return {
          isValid: false,
          message: validatorRules.errorMessage || 'Object does not match the required pattern.'
        };
      }
    }

    if (validatorRules.customValidator && !validatorRules.customValidator(params)) {
      return {
        isValid: false,
        message: validatorRules.errorMessage || 'Object failed custom validation.'
      };
    }


    if (validatorRules.childrens) {
      for (let key of Object.keys(validatorRules.childrens)) {
        //@ts-ignore
        const rule = validatorRules.childrens[key];

        // @ts-ignore
        const param = params[key];

        if (param === undefined || rule === null) {
          continue;
        }

        const result = this.dynamicValidation(param, rule);

        // If any validation fails, return the first failure message and set isValid to false
        if (!result.isValid) {
          return result
        }

      }
    }


    return {
      isValid: true,
      message: null
    }
  }

  public validateArray<T>(param: T[], validatorRules: ArrayValidationRules<T[]>): ValidatorResponse {
    // Check if the param is required and if it's present
    if (validatorRules.required && param === undefined) {
      return {
        isValid: false,
        message: validatorRules.errorMessage || 'Array is required.'
      };
    }

    // Check if null is allowed
    if (param === null && validatorRules.nullAllowed !== undefined && !validatorRules.nullAllowed) {
      return {
        isValid: false,
        message: validatorRules.errorMessage || 'Null is not allowed.'
      };
    }

    // Check minLength rule
    if (validatorRules.minLength !== undefined && param.length < validatorRules.minLength) {
      return {
        isValid: false,
        message: validatorRules.errorMessage || `Array must contain at least ${validatorRules.minLength} items.`
      };
    }

    // Check maxLength rule
    if (validatorRules.maxLength !== undefined && param.length > validatorRules.maxLength) {
      return {
        isValid: false,
        message: validatorRules.errorMessage || `Array must contain no more than ${validatorRules.maxLength} items.`
      };
    }

    if (!validatorRules.allowEmpty && param.length === 0) {
      return {
        isValid: false,
        message: validatorRules.errorMessage || 'Array must not be empty.'
      }
    }


    // Check customValidator if provided
    if (validatorRules.customValidator && !validatorRules.customValidator(param)) {
      return {
        isValid: false,
        message: validatorRules.errorMessage || 'Array failed custom validation.'
      };
    }

    if (param.length > 0 && validatorRules.itemValidationRules) {
      // Array item validation

      for (let item of param) {
        const result = this.dynamicValidation(item, validatorRules.itemValidationRules);

        if (!result.isValid) {
          return result;
        }
      }
    }

    // If all checks pass, the array is valid
    return {
      isValid: true,
      message: null
    };
  }

  private dynamicValidation(param: any, validatorRules: any): ValidatorResponse {
    const constructorName: string = param.constructor.name;

    let result: ValidatorResponse;

    if (constructorName === String.name) {
      result = this.validateString(param as string, validatorRules as StringValidationRules);
    } else if (constructorName === Number.name) {
      result = this.validateNumber(param as number, validatorRules as NumberValidationRules);
    } else if (constructorName === Array.name) {
      result = this.validateArray(param as any[], validatorRules as ArrayValidationRules<any>);
    } else if (constructorName === Object.name) {
      result = this.validateObject(param as object, validatorRules as ObjectValidationRules<any>);
    } else {
      result = {
        isValid: false,
        message: `Invalid data type for param: ${param}`
      }
    }

    return result;
  }
}

const validation = new Validation();

export default validation;