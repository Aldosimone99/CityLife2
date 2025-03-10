import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

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

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    console.log('Attempting to login with username:', this.username);
    this.http.post('/api/users/login', { username: this.username, password: this.password }).subscribe(
      (response: any) => {
        console.log('Login successful:', response);
        // Handle successful login
        this.router.navigate(['/dashboard']);
      },
      (error) => {
        console.error('Login error:', error);
        // Handle login error
        this.errorMessage = 'Invalid username or password';
      }
    );
  }

  switchLanguage(language: string) {
    // Implement language switch logic
  }
}