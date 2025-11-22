export type LoginFormValues = {
  identifier: string;
  password: string;
};

export type RegisterFormValues = LoginFormValues & {
  firstName: string;
  lastName: string;
  email: string;
};

export type FormErrors = Record<string, string>;

const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/;
const hasNumber = /\d/;
const hasLetter = /[A-Za-z]/;

const isBlank = (value?: string) => !value || !value.trim().length;
const normalize = (value?: string) => value?.trim() ?? '';

export const validateLoginForm = (values: LoginFormValues): FormErrors => {
  const errors: FormErrors = {};

  if (isBlank(values.identifier)) {
    errors.identifier = 'Username or email is required.';
  }

  if (isBlank(values.password)) {
    errors.password = 'Password is required.';
  }

  return errors;
};

export const validateRegisterForm = (values: RegisterFormValues): FormErrors => {
  const errors = validateLoginForm(values);

  if (isBlank(values.firstName)) {
    errors.firstName = 'First name is required.';
  }

  if (isBlank(values.lastName)) {
    errors.lastName = 'Last name is required.';
  }

  const email = normalize(values.email);
  if (!email) {
    errors.email = 'Email is required.';
  } else if (!emailRegex.test(email)) {
    errors.email = 'Enter a valid email address.';
  }

  const password = values.password ?? '';
  if (password.length < 8) {
    errors.password = 'Password must be at least 8 characters.';
  } else if (!hasLetter.test(password) || !hasNumber.test(password)) {
    errors.password = 'Use letters and numbers for a stronger password.';
  }

  if (values.identifier && values.identifier.length < 3) {
    errors.identifier = 'Username must be at least 3 characters.';
  }

  return errors;
};

export const hasErrors = (errors: FormErrors) => Object.keys(errors).length > 0;
