import * as swaggerUi from 'swagger-ui-express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import path from 'path';
import admin from 'firebase-admin';

import { RegisterRoutes } from './routes/routes';
import { ValidateError } from 'tsoa';
import { decrypt } from './utils/encrypt';
import { Client } from 'coinbase-commerce-node';
// const { Client, Webhook, resources } = require('coinbase-commerce-node');

const { serviceAccount } = require('./configs/firebase');

class App {
  public readonly app: express.Express;
  public readonly port: string | number;
  public readonly env: boolean;

  constructor() {
    this.app = express();
    this.port = process.env.APP_PORT || 3015;
    this.env = process.env.NODE_ENV === 'production' ? true : false;

    this.middleware();
    this.routes();
    this.initializeErrorHandling();
    this.initializeFirebase();
    this.iniializeCoinbase();
    this.startSwagger();
    this.handleError();
  }

  public start(): void {
    // start server
    this.app.listen(this.port, () => {
      console.log(`🚀 App listening on the port ${this.port}`);
    });
  }

  public express(): express.Express {
    return this.app;
  }

  private routes(): void {
    RegisterRoutes(this.app);
  }

  private middleware(): void {
    if (this.env) {
      this.app.use(hpp());
      this.app.use(helmet());
      this.app.use(morgan('combined'));
      this.app.use(cors({ origin: 'your.domain.com', credentials: true }));
    } else {
      this.app.use(morgan('dev'));
      this.app.use(cors({ origin: true, credentials: true }));
    }

    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
    this.app.use(function (req, res, next) {
      const { where } = req.query;
      if (where) req.query.where = decrypt(where);
      next();
    });
  }

  private initializeErrorHandling(): void {
    // this.app.use(errorMiddleware);
  }

  private startSwagger(): void {
    try {
      const swaggerDoc = require(path.resolve(__dirname, './', 'swagger.json'));
      this.app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
    } catch (error) {
      console.error(error);
    }
  }

  private initializeFirebase(): void {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: process.env.DB_URL || 'https://payment-app-4bc33-default-rtdb.firebaseio.com/',
    });
  }

  private handleError(): void {
    this.app.use(function errorHandler(
      err: any,
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) {
      if (err?.status < 500) {
        return res.status(err.status).json({
          message: err.message,
          status: false,
        });
      }

      if (err instanceof ValidateError) {
        console.warn(`Caught Validation Error for ${req.path}:`, err.fields);
        return res.status(422).json({
          status: false,
          message: 'Validation Failed',
          details: err?.fields,
        });
      }

      if (err instanceof Error) {
        return res.status(500).json({
          message: err.message,
          status: false,
        });
      }

      next();
    });
  }

  private iniializeCoinbase() {
    Client.init(process.env.COINBASE_API_KEY || '637334de-94fe-4b51-9dd7-8c6f737cedf5');
  }
}

export default App;
