import express from 'express';

import compression from 'compression';
import cors from 'cors';

import * as dotenv from 'dotenv';

dotenv.config();

import dbInitialize from '@config/database/initialization';

import { AuthRoutes } from '@routes/authRoutes';
import { EmailTokenRoutes } from '@routes/emailTokenRoutes';
import { UserRoutes } from '@routes/userRoutes';

class Server {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.config();
    this.routes();
    this.postgres();
  }

  public start = (): void => {
    this.app.listen(this.app.get('port'), () => {
      console.log('API is running at http://localhost:%d', this.app.get('port'));
    });
  };

  public routes = (): void => {
    this.app.use('/auth', new AuthRoutes().router);
    this.app.use('/api/user', new UserRoutes().router);
    this.app.use('/email-code', new EmailTokenRoutes().router);
  };

  public config = (): void => {
    this.app.set('port', process.env.PORT || 3000);
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(compression());
    this.app.use(cors());
  };

  private postgres = () => {
    dbInitialize().catch((error) => console.error(error));
  };
}

const server = new Server();

server.start();
