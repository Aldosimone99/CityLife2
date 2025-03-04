// filepath: /Users/aldosimone/Documents/GitHub/CityLife/src/app/app.component.ts
import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: false,
})
export class AppComponent implements OnInit {
  title(title: any) {
    throw new Error('Method not implemented.');
  }
  showNavbar: boolean = true;
  currentLang: string = 'en'; // Lingua corrente (default)
  searchQuery: string = ''; // Query di ricerca

  constructor(
    private authService: AuthService,
    public router: Router,
    private translate: TranslateService
  ) {
    // Aggiungi le lingue supportate
    this.translate.addLangs(['en', 'it']);

    // Imposta la lingua predefinita
    this.translate.setDefaultLang(this.currentLang);
    this.translate.use(this.currentLang);
  }

  // Cambia lingua
  switchLanguage(lang: string) {
    this.currentLang = lang;
    this.translate.use(lang); // Cambia la lingua attiva
  }

  ngOnInit(): void {
    // Ascolta i cambiamenti di route
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Nascondi la navbar se la route è "/login"
        this.showNavbar = event.url !== '/login';
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  searchUser() {
    if (this.searchQuery) {
      this.router.navigate(['/users'], { queryParams: { query: this.searchQuery } });
    }
  }
}