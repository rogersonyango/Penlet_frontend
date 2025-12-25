/**
 * Strings Utility
 * String manipulation helpers
 */

/**
 * Convert string to camelCase
 */
export const toCamelCase = (str) => {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, '');
};

/**
 * Convert string to PascalCase
 */
export const toPascalCase = (str) => {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => word.toUpperCase())
    .replace(/\s+/g, '');
};

/**
 * Convert string to snake_case
 */
export const toSnakeCase = (str) => {
  return str
    .replace(/([A-Z])/g, '_$1')
    .toLowerCase()
    .replace(/^_/, '');
};

/**
 * Convert string to kebab-case
 */
export const toKebabCase = (str) => {
  return str
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase()
    .replace(/^-/, '');
};

/**
 * Remove HTML tags
 */
export const stripHtml = (html) => {
  return html.replace(/<[^>]*>/g, '');
};

/**
 * Escape HTML special characters
 */
export const escapeHtml = (text) => {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};

/**
 * Pluralize word
 */
export const pluralize = (word, count, plural = null) => {
  if (count === 1) return word;
  return plural || word + 's';
};

/**
 * Extract numbers from string
 */
export const extractNumbers = (str) => {
  return str.match(/\d+/g)?.map(Number) || [];
};

/**
 * Count words in string
 */
export const wordCount = (str) => {
  return str.trim().split(/\s+/).length;
};

/**
 * Reverse string
 */
export const reverse = (str) => {
  return str.split('').reverse().join('');
};

export default {
  toCamelCase,
  toPascalCase,
  toSnakeCase,
  toKebabCase,
  stripHtml,
  escapeHtml,
  pluralize,
  extractNumbers,
  wordCount,
  reverse,
};