/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request } from "express";
import { IUser } from "../models/user.model";

declare global {
    namespace Express {
        interface Request {
            user?: IUser
        }
    }
}