/**
 * Validates an email address.
 * @param email - The email address to validate.
 * @returns boolean - True if valid, false otherwise.
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validates a password.
 * @param password - The password to validate.
 * @returns boolean - True if valid, false otherwise.
 */
export const isValidPassword = (password: string): boolean => {
  // Passwords must be at least 6 characters long
  return password.length >= 6
}
