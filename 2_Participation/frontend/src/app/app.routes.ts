import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/components/dashboard/dashboard.component';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./core/components/landing/landing.component').then(
        (m) => m.LandingComponent
      ),
  },
  {
    path: 'auth/login',
    loadComponent: () =>
      import('./auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'auth/callback',
    loadComponent: () =>
      import('./auth/callback/callback.component').then(
        (m) => m.AuthCallbackComponent
      ),
  },
  {
    path: 'login',
    redirectTo: 'auth/login',
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./auth/components/register/register.component').then(
        (m) => m.RegisterComponent
      ),
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: 'form',
    loadComponent: () =>
      import('./form/form.component').then((m) => m.FormComponent),
  },
  {
    path: 'success',
    loadComponent: () =>
      import('./success/success.component').then((m) => m.SuccessComponent),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
