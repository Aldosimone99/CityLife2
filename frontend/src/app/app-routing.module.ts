import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component'; // Import RegisterComponent
import { UsersComponent } from './users/users.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { ProfileComponent } from './profile/profile.component';
import { AuthGuard } from './guards/auth.guards';
import { environment } from '../enviroments/enviroments';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full', data: { animation: 'LoginPage' } },
  { path: 'login', component: LoginComponent, data: { animation: 'LoginPage' } },
  { path: 'register', component: RegisterComponent, data: { animation: 'RegisterPage' } },
  { path: 'dashboard', component: DashboardComponent, data: { animation: 'DashboardPage' } },
  { path: 'users', component: UsersComponent, canActivate: environment.useAuthGuard ? [AuthGuard] : [], data: { animation: 'UsersPage' } },
  { path: 'user/:id', component: UserDetailComponent, canActivate: environment.useAuthGuard ? [AuthGuard] : [], data: { animation: 'UserDetailPage' } },
  { path: 'profile', component: ProfileComponent, canActivate: environment.useAuthGuard ? [AuthGuard] : [], data: { animation: 'ProfilePage' } }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }