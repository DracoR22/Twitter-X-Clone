import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catch-async-errors";

export const signupUser = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    
})