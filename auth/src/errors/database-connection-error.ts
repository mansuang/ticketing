import { ValidationError } from "express-validator";
import { CustomError } from "./custom-error";

export class DatabaseConnectionError extends CustomError {
    statusCode = 500;
    reason = 'Error connecting to database';
    constructor(public errors: ValidationError[]) {
        super('Error connecting to db');

        // Only because we are extending a build in class
        Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
    }

    serializeErrors() {
        return [
            { message: this.reason }
        ]
    }
}