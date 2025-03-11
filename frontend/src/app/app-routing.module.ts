import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component'; // Import RegisterComponent
import { UsersComponent } from './users/users.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { PostsComponent } from './posts/posts.component'; 
import { CommentsComponent } from './comments/comments.component';
import { ProfileComponent } from './profile/profile.component';
import { AuthGuard } from './guards/auth.guards';
import { environment } from '../enviroments/enviroments';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent }, // Add register route
  { path: 'dashboard', component: DashboardComponent },
  { path: 'users', component: UsersComponent, canActivate: environment.useAuthGuard ? [AuthGuard] : [] },
  { path: 'user/:id', component: UserDetailComponent, canActivate: environment.useAuthGuard ? [AuthGuard] : [] },
  { path: 'posts', component: PostsComponent, canActivate: environment.useAuthGuard ? [AuthGuard] : [] },
  { path: 'posts/:id/comments', component: CommentsComponent },
  { path: 'profile', component: ProfileComponent, canActivate: environment.useAuthGuard ? [AuthGuard] : [] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }