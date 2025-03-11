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
  firstName: string = '';
  lastName: string = '';
  password: string = '';
  email: string = '';
  username: string = ''; // Add username property
  gender: string = '';
  dobDay: number | null = null;
  dobMonth: number | null = null;
  dobYear: number | null = null;
  errorMessage: string = '';

  constructor(private http: HttpClient, private router: Router, private translate: TranslateService, private authService: AuthService) {
    this.translate.setDefaultLang('en'); // Set default language
  }

  onSubmit() {
    this.onRegister();
  }

  onRegister() {
    this.checkEmailAndUsername().then((isAvailable) => {
      if (isAvailable) {
        const newUser = {
          firstName: this.firstName,
          lastName: this.lastName,
          email: this.email,
          username: this.username, // Include username in the newUser object
          password: this.password,
          gender: this.gender,
          dob: `${this.dobYear}-${this.dobMonth}-${this.dobDay}`
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
      } else {
        this.errorMessage = this.translate.instant('EMAIL_OR_USERNAME_EXISTS');
      }
    });
  }

  checkEmailAndUsername(): Promise<boolean> {
    return new Promise((resolve) => {
      this.http.post('/api/users/check', { email: this.email, username: this.username }).subscribe(
        (response: any) => {
          resolve(response.isAvailable);
        },
        (error) => {
          console.error('Error checking email and username:', error);
          resolve(false);
        }
      );
    });
  }

  onLogin() {
    this.http.post('/api/users/login', { username: this.email, password: this.password }).subscribe(
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

  validateInput(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.value) {
      input.classList.add('invalid');
    } else {
      input.classList.remove('invalid');
    }
  }
}
