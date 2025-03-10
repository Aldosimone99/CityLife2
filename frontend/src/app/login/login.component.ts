import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

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
  isRegisterPopupVisible: boolean = false;
  registerEmail: string = '';
  registerUsername: string = '';
  registerPassword: string = '';

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) {}

  onSubmit() {
    console.log('Attempting to login with username:', this.username);
    this.http.post('/api/users/login', { username: this.username, password: this.password }).subscribe(
      (response: any) => {
        console.log('Login successful:', response);
        this.authService.setToken(response.token); // Store the token
        this.router.navigate(['/dashboard']);
      },
      (error) => {
        console.error('Login error:', error);
        this.errorMessage = 'Invalid username or password';
      }
    );
  }

  showRegisterPopup(event: Event) {
    event.preventDefault(); // Prevent the default link behavior
    this.isRegisterPopupVisible = true;
  }

  hideRegisterPopup() {
    this.isRegisterPopupVisible = false;
  }

  onRegister() {
    const newUser = {
      email: this.registerEmail,
      username: this.registerUsername,
      password: this.registerPassword
    };

    this.http.post('/api/users', newUser).subscribe(
      (response: any) => {
        console.log('User registered successfully:', response);
        this.hideRegisterPopup();
      },
      (error) => {
        console.error('Error registering user:', error);
      }
    );
  }

  switchLanguage(language: string) {
    // Implement language switch logic
  }
}