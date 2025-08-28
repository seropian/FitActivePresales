/**
 * Validation utilities for request data
 */

import type { ValidationResult, ValidationError } from "../types/index.js";

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number (Romanian format)
 */
export function isValidPhone(phone: string): boolean {
  if (!phone || typeof phone !== 'string') return false;
  // Romanian phone number patterns
  const phoneRegex = /^(\+40|0040|0)[2-9]\d{8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

/**
 * Validate order data
 */
export function validateOrder(order: any): ValidationResult {
  const errors: ValidationError[] = [];

  if (!order) {
    errors.push({ field: 'order', message: 'Order data is required' });
    return { isValid: false, errors };
  }

  if (!order.orderID || typeof order.orderID !== 'string') {
    errors.push({ field: 'orderID', message: 'Order ID is required and must be a string' });
  }

  if (!order.amount || typeof order.amount !== 'number' || order.amount <= 0) {
    errors.push({ field: 'amount', message: 'Amount is required and must be a positive number' });
  }

  if (order.currency && typeof order.currency !== 'string') {
    errors.push({ field: 'currency', message: 'Currency must be a string' });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validate billing data
 */
export function validateBilling(billing: any): ValidationResult {
  const errors: ValidationError[] = [];

  if (!billing) {
    errors.push({ field: 'billing', message: 'Billing data is required' });
    return { isValid: false, errors };
  }

  if (!billing.email || !isValidEmail(billing.email)) {
    errors.push({ field: 'email', message: 'Valid email is required' });
  }

  if (!billing.firstName || typeof billing.firstName !== 'string') {
    errors.push({ field: 'firstName', message: 'First name is required' });
  }

  if (!billing.lastName || typeof billing.lastName !== 'string') {
    errors.push({ field: 'lastName', message: 'Last name is required' });
  }

  if (!billing.city || typeof billing.city !== 'string') {
    errors.push({ field: 'city', message: 'City is required' });
  }

  if (billing.phone && !isValidPhone(billing.phone)) {
    errors.push({ field: 'phone', message: 'Invalid phone number format' });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validate company data (optional)
 */
export function validateCompany(company: any): ValidationResult {
  const errors: ValidationError[] = [];

  if (!company) {
    return { isValid: true, errors }; // Company data is optional
  }

  if (company.name && typeof company.name !== 'string') {
    errors.push({ field: 'name', message: 'Company name must be a string' });
  }

  if (company.vatCode && typeof company.vatCode !== 'string') {
    errors.push({ field: 'vatCode', message: 'VAT code must be a string' });
  }

  if (company.regCom && typeof company.regCom !== 'string') {
    errors.push({ field: 'regCom', message: 'Registration number must be a string' });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}
