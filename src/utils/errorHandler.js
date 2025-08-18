/**
 * Centralized error handling utility for consistent error management across the application
 */

/**
 * Error types for categorizing different kinds of errors
 */
export const ERROR_TYPES = {
  NETWORK: 'network',
  VALIDATION: 'validation', 
  AUTHENTICATION: 'authentication',
  AUTHORIZATION: 'authorization',
  NOT_FOUND: 'not_found',
  SERVER: 'server',
  UNKNOWN: 'unknown'
};

/**
 * User-friendly error messages that don't expose internal details
 */
const ERROR_MESSAGES = {
  [ERROR_TYPES.NETWORK]: 'Unable to connect to the server. Please check your internet connection and try again.',
  [ERROR_TYPES.VALIDATION]: 'Please check your input and try again.',
  [ERROR_TYPES.AUTHENTICATION]: 'Your session has expired. Please log in again.',
  [ERROR_TYPES.AUTHORIZATION]: 'You don\'t have permission to perform this action.',
  [ERROR_TYPES.NOT_FOUND]: 'The requested resource was not found.',
  [ERROR_TYPES.SERVER]: 'Something went wrong on our end. Please try again later.',
  [ERROR_TYPES.UNKNOWN]: 'An unexpected error occurred. Please try again later.'
};

/**
 * Categorizes an error based on status code and other properties
 * @param {Object} error - The error object
 * @returns {string} The error type
 */
const categorizeError = (error) => {
  // Network errors (no response)
  if (!error.status && (error.code === 'NETWORK_ERROR' || error.message?.includes('Network Error'))) {
    return ERROR_TYPES.NETWORK;
  }

  // HTTP status code based categorization
  switch (error.status) {
    case 400:
      return ERROR_TYPES.VALIDATION;
    case 401:
      return ERROR_TYPES.AUTHENTICATION;
    case 403:
      return ERROR_TYPES.AUTHORIZATION;
    case 404:
      return ERROR_TYPES.NOT_FOUND;
    case 422:
      return ERROR_TYPES.VALIDATION;
    case 500:
    case 502:
    case 503:
    case 504:
      return ERROR_TYPES.SERVER;
    default:
      return ERROR_TYPES.UNKNOWN;
  }
};

/**
 * Extracts a safe, user-friendly error message from an error object
 * @param {Object} error - The error object
 * @param {string} fallbackMessage - Custom fallback message
 * @returns {Object} Processed error with title and description
 */
export const processError = (error, fallbackMessage = null) => {
  const errorType = categorizeError(error);
  
  let title = 'Error';
  let description = fallbackMessage || ERROR_MESSAGES[errorType];

  // Handle validation errors with specific field messages
  if (errorType === ERROR_TYPES.VALIDATION && error.data?.errors) {
    const fieldErrors = Object.values(error.data.errors).flat();
    if (fieldErrors.length > 0) {
      description = fieldErrors[0]; // Show first validation error
      title = 'Validation Error';
    }
  }
  
  // Handle specific known error messages that are safe to show
  else if (error.data?.message && isSafeErrorMessage(error.data.message)) {
    description = error.data.message;
  }
  
  // For server errors, don't expose internal error messages
  else if (errorType === ERROR_TYPES.SERVER) {
    description = ERROR_MESSAGES[ERROR_TYPES.SERVER];
    title = 'Server Error';
  }

  return {
    title,
    description,
    type: errorType
  };
};

/**
 * Determines if an error message is safe to display to users
 * @param {string} message - The error message
 * @returns {boolean} Whether the message is safe to display
 */
const isSafeErrorMessage = (message) => {
  if (!message || typeof message !== 'string') return false;
  
  // Patterns that indicate internal/sensitive information
  const unsafePatterns = [
    /database/i,
    /sql/i,
    /connection/i,
    /internal server/i,
    /stack trace/i,
    /exception/i,
    /error at line/i,
    /query failed/i,
    /undefined method/i,
    /class not found/i
  ];
  
  return !unsafePatterns.some(pattern => pattern.test(message));
};

/**
 * Creates a standardized toast configuration for errors
 * @param {Object} error - The error object
 * @param {string} fallbackMessage - Custom fallback message
 * @returns {Object} Toast configuration object
 */
export const createErrorToast = (error, fallbackMessage = null) => {
  const processedError = processError(error, fallbackMessage);
  
  return {
    title: processedError.title,
    description: processedError.description,
    status: 'error',
    duration: 5000,
    isClosable: true
  };
};

/**
 * Creates a standardized toast configuration for success messages
 * @param {string} title - Success title
 * @param {string} description - Success description
 * @param {number} duration - Toast duration (default: 3000ms)
 * @returns {Object} Toast configuration object
 */
export const createSuccessToast = (title, description = null, duration = 3000) => {
  return {
    title,
    description,
    status: 'success',
    duration,
    isClosable: true
  };
};

/**
 * Logs errors for debugging while preventing sensitive information exposure
 * @param {string} context - Context where the error occurred
 * @param {Object} error - The error object
 */
export const logError = (context, error) => {
  console.error(`[${context}]`, {
    message: error.message,
    status: error.status,
    url: error.url,
    method: error.method,
    // Don't log full error data in production to avoid sensitive info exposure
    ...(process.env.NODE_ENV === 'development' && { fullError: error })
  });
};
