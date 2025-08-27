/**
 * Validation utilities for request data
 */

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email format
 */
export function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number (Romanian format)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if valid phone format
 */
export function isValidPhone(phone) {
  if (!phone || typeof phone !== 'string') return false;
  // Romanian phone number patterns
  const phoneRegex = /^(\+40|0040|0)[2-9]\d{8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

/**
 * Validate order data
 * @param {Object} order - Order object to validate
 * @returns {Object} Validation result with isValid and errors
 */
export function validateOrder(order) {
  const errors = [];

  if (!order) {
    errors.push('Order data is required');
    return { isValid: false, errors };
  }

  if (!order.orderID || typeof order.orderID !== 'string') {
    errors.push('Order ID is required and must be a string');
  }

  if (!order.amount || typeof order.amount !== 'number' || order.amount <= 0) {
    errors.push('Amount is required and must be a positive number');
  }

  if (order.currency && typeof order.currency !== 'string') {
    errors.push('Currency must be a string');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validate billing data
 * @param {Object} billing - Billing object to validate
 * @returns {Object} Validation result with isValid and errors
 */
export function validateBilling(billing) {
  const errors = [];

  if (!billing) {
    errors.push('Billing data is required');
    return { isValid: false, errors };
  }

  if (!billing.email || !isValidEmail(billing.email)) {
    errors.push('Valid email is required');
  }

  if (!billing.firstName || typeof billing.firstName !== 'string') {
    errors.push('First name is required');
  }

  if (!billing.lastName || typeof billing.lastName !== 'string') {
    errors.push('Last name is required');
  }

  if (!billing.city || typeof billing.city !== 'string') {
    errors.push('City is required');
  }

  if (billing.phone && !isValidPhone(billing.phone)) {
    errors.push('Invalid phone number format');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validate company data (optional)
 * @param {Object} company - Company object to validate
 * @returns {Object} Validation result with isValid and errors
 */
export function validateCompany(company) {
  const errors = [];

  if (!company) {
    return { isValid: true, errors }; // Company data is optional
  }

  if (company.name && typeof company.name !== 'string') {
    errors.push('Company name must be a string');
  }

  if (company.vatCode && typeof company.vatCode !== 'string') {
    errors.push('VAT code must be a string');
  }

  if (company.regCom && typeof company.regCom !== 'string') {
    errors.push('Registration number must be a string');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}
