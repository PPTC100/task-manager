import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private storage: StorageService) {}

  register(username: string, password: string) {
    const data = this.storage.getData();
    const newUser = { id: 'u' + Date.now(), username, password, groups: [] };
    data.users.push(newUser);
    this.storage.saveData(data);
    return newUser;
  }

  login(username: string, password: string) {
    const data = this.storage.getData();
    return data.users.find((u: any) => u.username === username && u.password === password);
  }

  updateUser(userId: string, newUsername: string, newPassword: string) {
    const data = this.storage.getData();
    const user = data.users.find((u: any) => u.id === userId);
    if (user) {
      user.username = newUsername;
      user.password = newPassword;
      this.storage.saveData(data);
      return user;
    }
    return null;
  }

  deleteUser(userId: string) {
    const data = this.storage.getData();
    data.users = data.users.filter((u: any) => u.id !== userId);
    data.groups.forEach((g: any) => {
      g.members = g.members.filter((m: string) => m !== userId);
    });
    this.storage.saveData(data);
  }
}
