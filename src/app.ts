import path, { dirname } from 'path';

import express, { Express, Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import { feedRoutes } from './routes';
import { HttpError } from './types';

const MONGODB_URI = 'mongodb://localhost:27017/messages';
const __dirname = path.resolve();
console.log('dirname', __dirname);

const app: Express = express();

app.use(bodyParser.json());
app.use('/images', express.static(path.join(__dirname, 'src', 'images')));

app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/feed', feedRoutes);

app.use((error: HttpError, req: Request, res: Response, next: NextFunction) => {
  const { statusCode: status, message } = error;
  res.status(status || 500).json({ message });
});

mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    console.log('Database connected');

    app.listen(8080, () => {
      console.log('app listening at port 8080');
    });
  })
  .catch((err) => {
    console.log('Database connection failed', err);
  });
