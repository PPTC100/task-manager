import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    FormsModule,
    MatIconModule,
    RouterModule
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  currentUser: any = {};
  username: string = '';
  password: string = '';

  constructor(
    private userService: UserService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    }
    if (!this.currentUser.id) {
      this.router.navigate(['/']);
    }
    this.username = this.currentUser.username;
    this.password = this.currentUser.password;
  }

  updateProfile() {
    const updatedUser = this.userService.updateUser(this.currentUser.id, this.username, this.password);
    if (updatedUser) {
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      }
      alert('Profil zaktualizowany!');
    } else {
      alert('Błąd podczas aktualizacji profilu.');
    }
  }

  deleteAccount() {
    if (confirm('Czy na pewno chcesz usunąć swoje konto? Tej akcji nie można cofnąć.')) {
      this.userService.deleteUser(this.currentUser.id);
      if (isPlatformBrowser(this.platformId)) {
        localStorage.removeItem('currentUser');
      }
      this.router.navigate(['/']);
    }
  }
}
