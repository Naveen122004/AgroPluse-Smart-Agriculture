export const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const validatePassword = (password) =>
  password.length >= 8 && /[A-Z]/.test(password) && /\d/.test(password);

export const validatePhone = (phone) => /^[6-9]\d{9}$/.test(phone);

export const getFieldError = (name, value, confirmPassword) => {
  switch (name) {
    case 'fullName':
      return value.trim() ? '' : 'Full name is required';
    case 'email':
      return validateEmail(value) ? '' : 'Enter a valid email address';
    case 'phone':
      return validatePhone(value) ? '' : 'Enter a valid 10-digit mobile number';
    case 'password':
      return validatePassword(value)
        ? ''
        : 'Password must be 8+ chars with 1 uppercase and 1 digit';
    case 'confirmPassword':
      return value === confirmPassword ? '' : 'Passwords do not match';
    default:
      return '';
  }
};
