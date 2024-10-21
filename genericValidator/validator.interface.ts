export interface CommonRules  {
  required?: boolean;
  nullAllowed?: boolean
  errorMessage?: string;
  pattern?: RegExp;

  customValidator?: (...args: any) => boolean;
}
export interface BooleanValidationRules extends Pick<CommonRules, 'customValidator' | 'errorMessage' | 'required'> {
  value: boolean;
}

export interface StringValidationRules extends CommonRules  {
  minLength?: number;
  maxLength?: number;
}

export interface NumberValidationRules extends CommonRules {
  min?: number;
  max?: number;
}

export type ArrayItemValidationRules<T> = T extends (infer U)[]
  ? U extends any[]
    ? ArrayValidationRules<U>
    : TypeBasedValidationRules<U>
  : TypeBasedValidationRules<T>;


export interface ArrayValidationRules<T> extends CommonRules{
  minLength?: number;
  maxLength?: number;
  allowEmpty?: boolean;

  itemValidationRules?: ArrayItemValidationRules<T>;
}

export interface ObjectValidationRules<T> extends CommonRules {
  childrens?: {
    [key in keyof T]?: TypeBasedValidationRules<T[key]>;
  }
}

export type TypeBasedValidationRules<T> = T extends any[]
  ? ArrayValidationRules<T> // Recursively apply for nested arrays
  : T extends object
  ? ObjectValidationRules<T> // If U is an object, apply ObjectValidationRules
  : T extends number
  ? NumberValidationRules // If U is a number, apply NumberValidationRules
  : T extends string
  ? StringValidationRules // If U is a string, apply StringValidationRules
  : T extends boolean
  ? BooleanValidationRules // If U is a boolean, apply BooleanValidationRules
  : never


export interface ValidatorResponse {
  isValid: boolean;
  message: string | null;
}

export interface ValidatorFunction {
  validateBoolean(param: boolean, validatorRules: BooleanValidationRules): ValidatorResponse;
  validateString(param: string, validatorRules: StringValidationRules): ValidatorResponse;
  validateNumber(param: number, validatorRules: NumberValidationRules): ValidatorResponse;
  validateObject<T>(params: T, validatorRules: ObjectValidationRules<T>): ValidatorResponse;
  validateArray<T=any[]>(param: T[], validatorRules: ArrayValidationRules<T[]>): ValidatorResponse;
}
