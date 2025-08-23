import { Routes } from '@angular/router';
import { Dashboard } from './auth/dashboard/dashboard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then((m) => m.routes),
  },
  {
    path: 'dashbaord',
    component: Dashboard,
  },
];
