import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    CommonModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  isLoggedIn(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem('currentUser');
    }
    return false;
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('currentUser');
    }
    this.router.navigate(['/']);
  }
}