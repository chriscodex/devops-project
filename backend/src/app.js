import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import authRoutes from './routes/auth.routes.js';
import taskRoutes from './routes/tasks.routes.js';
import ordenesRoutes from './routes/ordenes.routes.js';
import equipoRoutes from './routes/equipo.routes.js';
import clientRoutes from './routes/clients.routes.js';
import tecnicoRoutes from './routes/tecnicos.routes.js';
import userRoutes from './routes/users.routes.js';

import dotenv from 'dotenv';

dotenv.config();

const app = express();

const clientUrl = process.env.CLIENT_URL;

console.log('client URL',clientUrl);


app.use(
  cors({
    origin: clientUrl,
    credentials: true,
  })
);
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

app.use('/api', authRoutes);
app.use('/api', taskRoutes);
app.use('/api', ordenesRoutes);
app.use('/api', equipoRoutes);
app.use('/api', clientRoutes);
app.use('/api', tecnicoRoutes);
app.use('/api', userRoutes);

export default app;
