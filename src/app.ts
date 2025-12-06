import express, { Request, Response } from 'express';
import authRouter from './modules/auth/auth.routes';
import initDB from './config/database';

const app = express();

app.use(express.json());

initDB();

app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to the API');
});

app.use('/api/v1/auth', authRouter);

export default app;