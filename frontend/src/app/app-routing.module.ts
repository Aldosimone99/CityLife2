// filepath: /Users/aldosimone/Documents/GitHub/CityLife/src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { UsersComponent } from './users/users.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { PostsComponent } from './posts/posts.component'; 
import { CommentsComponent } from './comments/comments.component';
import { AuthGuard } from './guards/auth.guards';
import { environment } from '../enviroments/enviroments';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'users', component: UsersComponent, canActivate: environment.useAuthGuard ? [AuthGuard] : [] },
  { path: 'user/:id', component: UserDetailComponent, canActivate: environment.useAuthGuard ? [AuthGuard] : [] },
  { path: 'posts', component: PostsComponent, canActivate: environment.useAuthGuard ? [AuthGuard] : [] },
  { path: 'posts/:id/comments', component: CommentsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }