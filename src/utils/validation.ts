import { ValidationErrors } from '@/types';

export const validateName = (name: string): string | null => {
  if (!name.trim()) return 'Name is required';
  if (name.length < 20) return 'Name must be at least 20 characters';
  if (name.length > 60) return 'Name must not exceed 60 characters';
  return null;
};

export const validateEmail = (email: string): string | null => {
  if (!email.trim()) return 'Email is required';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return 'Please enter a valid email address';
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password) return 'Password is required';
  if (password.length < 8) return 'Password must be at least 8 characters';
  if (password.length > 16) return 'Password must not exceed 16 characters';
  if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter';
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return 'Password must contain at least one special character';
  return null;
};

export const validateAddress = (address: string): string | null => {
  if (!address.trim()) return 'Address is required';
  if (address.length > 400) return 'Address must not exceed 400 characters';
  return null;
};

export const validateUserForm = (data: {
  name: string;
  email: string;
  password: string;
  address: string;
}): ValidationErrors => {
  const errors: ValidationErrors = {};
  
  const nameError = validateName(data.name);
  if (nameError) errors.name = nameError;
  
  const emailError = validateEmail(data.email);
  if (emailError) errors.email = emailError;
  
  const passwordError = validatePassword(data.password);
  if (passwordError) errors.password = passwordError;
  
  const addressError = validateAddress(data.address);
  if (addressError) errors.address = addressError;
  
  return errors;
};