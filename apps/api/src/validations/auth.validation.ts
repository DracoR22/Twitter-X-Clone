import { body } from "express-validator";

export const registerValidation = [
    body("fullname").exists().withMessage("Provide a name").isString().withMessage("Name must be a string"),
    body("username").exists().withMessage("Provide a username").isString().withMessage("Username must be a string"),
    body("email").isEmail().normalizeEmail().withMessage("Provide a valid email address"),
    body("password").exists().withMessage("Provide a valid password").isString().withMessage("Password must be a string").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
];

export const loginValidation = [
    body("username").exists().withMessage("Provide a username").isString().withMessage("Username must be a string"),
    body("password").exists().withMessage("Provide a valid password").isString().withMessage("Password must be a string").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
]