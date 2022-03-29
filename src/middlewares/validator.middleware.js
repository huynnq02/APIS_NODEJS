export const ValidatorController = {
  isValidPassword(password) {
    validator.isLength(password, 8, 30);
  },
};
