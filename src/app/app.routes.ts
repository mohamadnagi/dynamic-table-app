import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/data-table',
    pathMatch: 'full'
  },
  {
    path: 'data-table',
    loadChildren: () => import('./features/data-table/data-table.routes').then(m => m.dataTableRoutes)
  },
  {
    path: '**',
    redirectTo: '/data-table'
  }
];
