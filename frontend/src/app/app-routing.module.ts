import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule)
  },
  {
    path: 'admin-dashboard',
    loadChildren: () => import('./admin/admin.module').then((m) => m.AdminModule),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin'] }
  },
  {
    path: 'analyst-dashboard',
    loadChildren: () => import('./analyst/analyst.module').then((m) => m.AnalystModule),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['analyst'] }
  },
  {
    path: 'employee-dashboard',
    loadChildren: () => import('./employee/employee.module').then((m) => m.EmployeeModule),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['employee'] }
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login'
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
