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
  }
}
