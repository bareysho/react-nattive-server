import { EmailTokenController } from '@controllers/emailTokenController';
import { Router, Router as routerCreator } from 'express';

export class EmailTokenRoutes {
  router: Router;

  constructor() {
    this.router = routerCreator();
    this.routes();
  }
  routes() {
    // For TEST only ! In production, you should use an Identity Provider !!
    this.router.post('/request-email-code', EmailTokenController.requestEmailToken);
    this.router.post('/verify-email-code', EmailTokenController.verifyEmailToken);
  }
}
