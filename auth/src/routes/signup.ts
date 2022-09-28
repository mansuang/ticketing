import express, { Request, Response } from 'express'
import { body, validationResult } from 'express-validator'
import { RequestValidationError } from '../errors/request-validation-error';
import { DatabaseConnectionError } from '../errors/database-connection-error';

const router = express.Router();

router.post('/api/users/signup', [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().isLength({ min: 4, max: 20 }).withMessage('Password must between 4 and 20 chars'),

], (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        throw new RequestValidationError(errors.array());
        // return res.status(400).send(errors.array());
    }

    const { email, password } = req.body;

    console.log('Creating a user...', req.body);
    throw new DatabaseConnectionError(errors.array());

    res.send({ message: 'signup' });
});

export { router as signupRouter };