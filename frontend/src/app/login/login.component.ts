import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: false,
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private translate: TranslateService
  ) {}

  onSubmit() {
    if (!this.username || !this.password) {
      this.translate.get('PLEASE_INSERT_CREDENTIALS').subscribe((res: string) => {
        this.errorMessage = res;
      });
      return;
    }

    this.authService.login({ username: this.username, password: this.password }).subscribe(
      (response) => {
        if (response.success) {
          this.authService.setToken(response.token);
          this.router.navigate(['/users']);
        } else {
          this.translate.get('INVALID_CREDENTIALS').subscribe((res: string) => {
            this.errorMessage = res;
          });
        }
      },
      (error: any) => {
        console.error('Invalid credentials', error);
        this.translate.get('INVALID_CREDENTIALS').subscribe((res: string) => {
          this.errorMessage = res;
        });
      }
    );
  }

  switchLanguage(language: string) {
    this.translate.use(language);
  }
}