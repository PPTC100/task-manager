import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  constructor(
    private storage: StorageService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  createGroup(name: string, userId: string) {
    const data = this.storage.getData();
    const newGroup = { id: 'g' + Date.now(), name, members: [userId], tasks: [] };
    data.groups.push(newGroup);
    const user = data.users.find((u: any) => u.id === userId);
    user.groups.push(newGroup.id);
    this.storage.saveData(data);
    return newGroup;
  }

  getUserGroups(userId: string) {
    const data = this.storage.getData();
    return data.groups.filter((g: any) => g.members.includes(userId));
  }

  addMemberToGroup(groupId: string, username: string) {
    const data = this.storage.getData();
    const group = data.groups.find((g: any) => g.id === groupId);
    const user = data.users.find((u: any) => u.username === username);

    if (!group || !user) {
      return false;
    }

    if (group.members.includes(user.id)) {
      return false;
    }

    group.members.push(user.id);
    user.groups.push(group.id);
    this.storage.saveData(data);
    return true;
  }
}
