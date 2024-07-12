// Email validation
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation (example: at least 6 characters)
export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

// Generic validation function
export const validateRequiredField = (value: string): boolean => {
  return value.trim().length > 0;
};

// You can add more validation functions as needed
