import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard'; // Import AuthGuard

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule) },
  { path: 'employee-list', loadChildren: () => import('./pages/employee-list/employee-list.module').then(m => m.EmployeeListPageModule), canActivate: [AuthGuard] },
  { path: 'employee-details/:id', loadChildren: () => import('./pages/employee-details/employee-details.module').then(m => m.EmployeeDetailsPageModule), canActivate: [AuthGuard] },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
