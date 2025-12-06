import express, { Request, Response } from 'express';
import authRouter from './modules/auth/auth.routes';
import initDB from './config/database';
import vehicleRoutes from './modules/vehicle/vehicle.routes';
import userRoutes from './modules/user/user.routes';

const app = express();

app.use(express.json());

initDB();

app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to the API');
});

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/vehicles', vehicleRoutes);
app.use('/api/v1/users', userRoutes);

export default app;