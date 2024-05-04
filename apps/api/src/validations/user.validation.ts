import { body } from 'express-validator';

export const updateUserValidation = [
    body("fullname").optional().isString().withMessage("Name must be a string"),
    body("username").optional().isString().withMessage("Username must be a string"),
    body("email").optional().isEmail().normalizeEmail().withMessage("Provide a valid email address"),
    body("currentPassword").optional().isString().withMessage("Current password must be a string").isLength({ min: 6 }).withMessage("New password must be at least 6 characters long"),
    body("newPassword").optional().isString().withMessage("New password must be a string").isLength({ min: 6 }).withMessage("New password must be at least 6 characters long"),
    body("bio").optional().isString().withMessage("Bio must be a string"),
    body("link").optional().isString().withMessage("Link must be a string"),
    body("profileImg").optional().isString().withMessage("ProfileImg must be a string"),
    body("coverImg").optional().isString().withMessage("CoverImg must be a string"),
];

