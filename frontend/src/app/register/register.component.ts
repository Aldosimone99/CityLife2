import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  standalone: true,
  styleUrls: ['./register.component.css'],
  imports: [TranslateModule, FormsModule, CommonModule] // Include CommonModule
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
  age: number | null = null; // Add age property
  errorMessage: string = '';
  showPopup: boolean = false; // Add showPopup property
  isFormValid: boolean = false; // Add isFormValid property
  formError: boolean = false; // Add formError property

  constructor(private http: HttpClient, private router: Router, private translate: TranslateService, private authService: AuthService) {
    this.translate.setDefaultLang('en'); // Set default language
  }

  onSubmit() {
    this.checkFormValidity();
    if (this.isFormValid) {
      this.onRegister();
    } else {
      this.formError = true; // Show form error message
    }
  }

  onRegister() {
    this.checkEmailAndUsername().then((isAvailable) => {
      if (isAvailable) {
        const newUser = {
          firstName: this.firstName,
          lastName: this.lastName,
          email: this.email.toLowerCase(), // Ensure email is case-insensitive
          username: this.username, // Include username in the newUser object
          password: this.password,
          gender: this.gender,
          dob: `${this.dobYear}-${this.dobMonth}-${this.dobDay}`,
          age: this.age // Include age in the newUser object
        };

        this.http.post('/api/users', newUser, { observe: 'response' }).subscribe(
          (response) => {
            if (response.status === 200) { // Check for 200 OK status
              console.log('User registered successfully:', response);
              this.showPopup = true; // Show the popup after successful registration
              this.errorMessage = ''; // Clear any previous error messages
              alert('Utente registrato'); // Add positive feedback message
              this.router.navigate(['/login']); // Redirect to the login page
            } else {
              this.errorMessage = this.translate.instant('REGISTRATION_ERROR');
            }
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
      this.http.post('/api/users/check', { email: this.email.toLowerCase(), username: this.username }).subscribe(
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

  validateInput(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.value) {
      input.classList.add('invalid');
    } else {
      input.classList.remove('invalid');
    }
    this.checkFormValidity();
  }

  checkFormValidity() {
    this.isFormValid = !!(this.firstName && this.lastName && this.email && this.username && this.password && this.gender && this.age !== null);
    this.formError = !this.isFormValid; // Update form error state
  }

  goToLogin() {
    this.router.navigate(['/login']); // Navigate to the login page
  }
}
