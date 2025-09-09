import { Routes } from '@angular/router';
import { ResultComponent } from './shared/components/result/result.component';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./shared/components/result/result.component').then(
        (m) => m.ResultComponent
      ),
  },
  {
    path: 'test',
    loadComponent: () =>
      import('./shared/components/test/test.component').then(
        (m) => m.TestComponent
      ),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
