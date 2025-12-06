import express, { Request, Response } from 'express';
import authRouter from './modules/auth/auth.routes';
import initDB from './config/database';
import vehicleRoutes from './modules/auth/vehicle/vehicle.routes';

const app = express();

app.use(express.json());

initDB();

app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to the API');
});

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/vehicles', vehicleRoutes);

export default app;