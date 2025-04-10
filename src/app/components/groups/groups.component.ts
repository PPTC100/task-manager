import { Component, OnInit } from '@angular/core';
import { GroupService } from '../../services/group.service';
import { Router, RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { StorageService } from '../../services/storage.service';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-groups',
  standalone: true,
  imports: [
    CommonModule,
    MatListModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    FormsModule,
    MatIconModule,
    RouterModule,
    MatExpansionModule
  ],
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss']
})
export class GroupsComponent implements OnInit {
  groups: any[] = [];
  groupName = '';
  inviteUsername = '';
  currentUser: any = {};

  constructor(
    private groupService: GroupService,
    private storageService: StorageService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      console.log('Current User:', this.currentUser);
      this.groups = this.groupService.getUserGroups(this.currentUser.id) || [];
      console.log('Groups:', this.groups);
    }
  }

  createGroup() {
    if (!this.groupName.trim()) {
      alert('Nazwa grupy nie może być pusta!');
      return;
    }
    this.groupService.createGroup(this.groupName, this.currentUser.id);
    this.groups = this.groupService.getUserGroups(this.currentUser.id) || [];
    this.groupName = '';
  }

  viewTasks(groupId: string) {
    this.router.navigate(['/tasks', groupId]);
  }

  inviteMember(groupId: string) {
    if (!this.inviteUsername.trim()) {
      alert('Nazwa użytkownika nie może być pusta!');
      return;
    }
    const success = this.groupService.addMemberToGroup(groupId, this.inviteUsername);
    if (success) {
      alert(${this.inviteUsername} został dodany do grupy!);
      this.groups = this.groupService.getUserGroups(this.currentUser.id) || [];
    } else {
      alert('Nie znaleziono użytkownika lub użytkownik już jest w grupie.');
    }
    this.inviteUsername = '';
  }

  getMemberNames(group: any): string[] {
    const data = this.storageService.getData();
    if (!group || !group.members) return [];
    return group.members.map((memberId: string) => {
      const user = data.users.find((u: any) => u.id === memberId);
      return user ? user.username : 'Nieznany użytkownik';
    });
  }
}
