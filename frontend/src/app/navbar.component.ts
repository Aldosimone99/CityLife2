import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  standalone: false
})
export class NavbarComponent {
  constructor(
    private router: Router,
    private translate: TranslateService
  ) {}

  logout() {
    localStorage.removeItem('authToken');
    this.router.navigate(['/login']);
  }

  changeLanguage(language: string) {
    this.translate.use(language);
  }
}