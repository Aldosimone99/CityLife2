import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: false,
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private http: HttpClient, private router: Router, private authService: AuthService, private translate: TranslateService) {
    this.translate.setDefaultLang('en'); // Set default language
  }

  onSubmit() {
    this.onLogin();
  }

  onLogin() {
    console.log('Attempting to login with username:', this.username);
    this.http.post('/api/users/login', { username: this.username, password: this.password }).subscribe(
      (response: any) => {
        console.log('Login successful:', response);
        this.authService.setUserId(response.id); // Store the user ID
        this.router.navigate(['/dashboard']);
      },
      (error) => {
        console.error('Login error:', error);
        this.errorMessage = this.translate.instant('INVALID_USERNAME_OR_PASSWORD');
      }
    );
  }

  switchLanguage(language: string) {
    this.translate.use(language);
  }
}