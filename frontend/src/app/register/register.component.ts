import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  standalone: true,
  styleUrls: ['./register.component.css'],
  imports: [TranslateModule, FormsModule]
})
export class RegisterComponent {
  username: string = '';
  password: string = '';
  email: string = '';
  gender: string = '';
  age: number | null = null;
  errorMessage: string = '';

  constructor(private http: HttpClient, private router: Router, private translate: TranslateService, private authService: AuthService) {
    this.translate.setDefaultLang('en'); // Set default language
  }

  onSubmit() {
    this.onRegister();
  }

  onRegister() {
    const newUser = {
      email: this.email,
      username: this.username,
      password: this.password,
      gender: this.gender,
      age: this.age
    };

    this.http.post('/api/users', newUser).subscribe(
      (response: any) => {
        console.log('User registered successfully:', response);
        this.onLogin(); // Log in the user after successful registration
      },
      (error) => {
        console.error('Error registering user:', error);
        this.errorMessage = this.translate.instant('REGISTRATION_ERROR');
      }
    );
  }

  onLogin() {
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
