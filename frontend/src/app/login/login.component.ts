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
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private http: HttpClient, private router: Router, private authService: AuthService, private translate: TranslateService) {
    this.translate.setDefaultLang('en'); // Set default language
  }

  onSubmit() {
    this.onLogin();
  }

  onLogin() {
    const loginData = {
        email: this.email,
        password: this.password
    };

    this.http.post<{ token: string; id: number }>('/api/users/login', loginData).subscribe({
        next: (response) => {
            console.log('Login successful:', response);
            localStorage.setItem('authToken', response.token); // Store token in localStorage
            localStorage.setItem('userId', response.id.toString()); // Store user ID in localStorage
            this.router.navigate(['/profile']); // Redirect to profile page
            this.errorMessage = ''; // Clear error message on successful login
        },
        error: (error) => {
            console.error('Login error:', error);
            if (error.status === 403) {
                this.errorMessage = 'Access Forbidden. Please check your credentials.';
            } else {
                this.errorMessage = 'Login failed. Please check your credentials.';
            }
        }
    });
  }

  switchLanguage(language: string) {
    this.translate.use(language);
  }
}