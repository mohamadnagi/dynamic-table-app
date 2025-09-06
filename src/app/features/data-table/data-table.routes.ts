import { Routes } from '@angular/router';

export const dataTableRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/examples/data-table-page/data-table-page.component').then(m => m.DataTablePageComponent)
  },
  {
    path: 'posts',
    loadComponent: () => import('./components/examples/posts-management/posts-management.component').then(m => m.PostsManagementComponent)
  },
  {
    path: 'users',
    loadComponent: () => import('./components/examples/users-management/users-management.component').then(m => m.UsersManagementComponent)
  }
];
