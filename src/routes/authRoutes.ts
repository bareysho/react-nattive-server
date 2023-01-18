import { AuthController } from '@controllers/authController';
import { AuthService } from '@service/authService';
import { Router, Router as routerCreator } from 'express';

export class AuthRoutes {
  router: Router;

  constructor() {
    this.router = routerCreator();
    this.routes();
  }
  routes() {
    // For TEST only ! In production, you should use an Identity Provider !!
    this.router.post('/authenticate', AuthController.authenticateUser);
    this.router.post('/refresh-token', AuthController.refreshToken);
    this.router.post('/registration', AuthController.registerUser);
    this.router.patch('/verify-registration', AuthController.verifyRegistration);
    this.router.post('/revoke-token', AuthService.authenticateJWT(AuthController.revokeToken));
  }
}
