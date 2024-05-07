---
to: apps/api/src/controllers/<%= name %>.controller.ts
---
import { CatchAsyncError } from "../middleware/catch-async-errors";
import { NextFunction, Request, Response } from "express";

export const <%= h.changeCase.pascal(name) %> = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {

    } catch {
        
    }
})