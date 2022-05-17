import * as swaggerUi from 'swagger-ui-express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import path from 'path';
import session from 'express-session';
import admin from 'firebase-admin';

import { RegisterRoutes } from './routes/routes';
import { ValidateError } from 'tsoa';
import { decrypt } from './utils/encrypt';
import { Client } from 'coinbase-commerce-node';
import { isJson } from './utils/string';
// const { Client, Webhook, resources } = require('coinbase-commerce-node');

const serviceAccount = require('./configs/firebase/serviceAccountKey.json');
const FileStore = require('session-file-store')(session);

class App {
  public readonly app: express.Express;
  public readonly port: string | number;
  public readonly env: boolean;

  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3015;
    this.env = process.env.NODE_ENV === 'production' ? true : false;

    this.middleware();
    this.routes();
    this.initializeSession();
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

  private initializeSession(): void {
    this.app.use(
      session({
        resave: false,
        saveUninitialized: false,
        secret: process.env.ENCRYPT_KEY,
        store: new FileStore(),
        expires: new Date(Date.now() + 30 * 86400 * 1000), // 30 days
      }),
    );
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
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
  }

  private handleError(): void {
    this.app.use(function errorHandler(
      err: any,
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) {
      if (isJson(err.message)) {
        const errJson = JSON.parse(err.message || '{}');
        if (errJson?.status === 401) {
          return res.status(401).json({
            message: errJson?.message,
            status: false,
          });
        }
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
    const COINBASE_API_KEY = '637334de-94fe-4b51-9dd7-8c6f737cedf5';
    Client.init(COINBASE_API_KEY);
  }
}

export default App;
