import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private storageKey = 'taskManagerData';

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  getData(): any {
    if (isPlatformBrowser(this.platformId)) {
      return JSON.parse(localStorage.getItem(this.storageKey) || '{"users": [], "groups": []}');
    }
    return { users: [], groups: [] };
  }

  saveData(data: any): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    }
  }
}
