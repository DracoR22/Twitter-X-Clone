import { body } from "express-validator";

export const createPostValidation = [
    body("text").optional().isString().withMessage("Title is required"),
    body("img").optional().isString().withMessage("Img is required"),
]

export const commentOnPostValidation = [
    body("text").exists().isString().isLength({ min: 3 }).withMessage('Provide a valid comment')
]

