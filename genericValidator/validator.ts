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
    throw new Error("Method not implemented.");
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


    for (let key in Object.keys(validatorRules)) {
      //@ts-ignore
      const rule = validatorRules[key];

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

    return {
      isValid: true,
      message: null
    }
  }

  public validateArray<T>(param: T[], validatorRules: ArrayValidationRules<T>): ValidatorResponse {
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



const sampleObject = {
  name: "John Doe",           // String
  age: 28,                    // Number
  email: "john.doe@example.com", // String
  isActive: true,             // Boolean
  address: {                  // Nested Object
    street: "123 Main St",    // String
    city: "New York",         // String
    zipCode: "10001"          // String
  },
  phoneNumbers: [             // Array of Strings
    "+1-555-555-5555",
    "+1-555-555-5556"
  ],
  preferences: {              // Nested Object
    notifications: {          // Nested Object
      email: true,            // Boolean
      sms: false,             // Boolean
      push: true              // Boolean
    }
  },
  tags: ["premium", "vip"],   // Array of Strings
  metadata: {                 // Nested Object with mixed data types
    lastLogin: "2024-10-19T12:34:56Z", // String (ISO date)
    loginAttempts: 5,         // Number
    history: [                // Array of Objects
      {
        date: "2024-09-15T10:20:30Z", // String (ISO date)
        action: "login"
      },
      {
        date: "2024-09-16T11:25:35Z", // String (ISO date)
        action: "logout"
      }
    ]
  },
  customData: [               // Array with mixed data types
    { key: "height", param: 180 },    // Object (key-param pair)
    { key: "weight", param: 75 }
  ],
  preferencesArray: [         // Array of objects
    {
      setting: "darkMode",    // String
      enabled: true           // Boolean
    },
    {
      setting: "autoSave",    // String
      enabled: false          // Boolean
    }
  ],
  nestedArray: [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
  ]
};
