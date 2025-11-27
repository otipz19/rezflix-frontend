import {ValidationErrors} from "@angular/forms";

export function getValidationErrorMessage(errors: ValidationErrors | null): string {
  if (!errors) {
    return '';
  }
  const [errorName, errorData] = Object.entries(errors)[0];
  if (errorName in ERROR_TO_MESSAGE) {
    const message = ERROR_TO_MESSAGE[errorName as ValidationErrorKey];
    return typeof message === 'function' ? message(errorData) : message;
  }
  return "Error";
}

export type CustomValidationErrorKey =
  'passwordsAreNotEqual'
  | 'invalidEmailFormat'
  | 'invalidPhoneFormat'
  | 'phoneExists'
  | 'emailExists'
  | 'usernameExists';

type DefaultValidationErrorKey =
  'required'
  | 'pattern'
  | 'maxlength'
  | 'minlength'
  | 'min'
  | 'max';

type ValidationErrorKey = DefaultValidationErrorKey | CustomValidationErrorKey;

export const CUSTOM_VALIDATION_ERROR_KEY: Record<CustomValidationErrorKey, CustomValidationErrorKey> = {
  invalidEmailFormat: 'invalidEmailFormat',
  passwordsAreNotEqual: 'passwordsAreNotEqual',
  invalidPhoneFormat: 'invalidPhoneFormat',
  phoneExists: 'phoneExists',
  emailExists: 'emailExists',
  usernameExists: 'usernameExists',
};

const ERROR_TO_MESSAGE: Record<ValidationErrorKey, string | ((error: any) => string)> = {
  required: "This field is required",
  pattern: "Invalid format",
  maxlength: ({requiredLength}: any) => `Maximum length is ${requiredLength} characters`,
  minlength: ({requiredLength}: any) => `Minimum length is ${requiredLength} characters`,
  min: ({min}: any) => `Minimum value: ${min}`,
  max: ({max}: any) => `Maximum value: ${max}`,
  passwordsAreNotEqual: "Passwords must match",
  invalidEmailFormat: ({tip}: any) => buildMessageWithTip('Invalid email format', tip),
  invalidPhoneFormat: ({tip}: any) => buildMessageWithTip('Invalid phone number format', tip),
  phoneExists: 'Phone number is already in use',
  emailExists: 'Email is already in use',
  usernameExists: "Username is taken",
} as const;

function buildMessageWithTip(msg: string, tip?: string): string {
  let result = msg;
  if(tip) {
    result += '. '
    result += tip;
  }
  return result;
}
