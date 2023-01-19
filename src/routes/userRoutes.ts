import { UserController } from '@controllers/userController';
import { AuthService } from '@service/authService';
import { Router, Router as routerCreator } from 'express';

export class UserRoutes {
  router: Router;

  constructor() {
    this.router = routerCreator();
    this.routes();
  }
  routes() {
    // For TEST only ! In production, you should use an Identity Provider !!
    this.router.get('/:id', AuthService.authenticateJWT(UserController.getUserById));
    this.router.patch('/change-password', AuthService.authenticateJWT(UserController.changePassword));
    this.router.patch('/change-email', AuthService.authenticateJWT(UserController.verifyChangeEmail));
    this.router.post('/request-change-email-code', AuthService.authenticateJWT(UserController.requestChangeEmailCode));
  }
}
