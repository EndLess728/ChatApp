export function validateEmail(email) {
  // Define the regex pattern for email validation
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // Test the email using the regex
  return emailPattern.test(email);
}

export function validatePasswordLength(password) {
  // Check if the password length is exactly 6 characters
  return password.length >= 6;
}
