/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request } from "express";
import { IUser } from "./interfaces/user-interface";

declare global {
    namespace Express {
        interface Request {
            user?: IUser
        }
    }
}