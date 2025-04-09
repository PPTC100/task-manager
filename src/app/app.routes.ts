import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { GroupsComponent } from './components/groups/groups.component';
import { TasksComponent } from './components/tasks/tasks.component';
import { ProfileComponent } from './components/profile/profile.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'groups', component: GroupsComponent },
  { path: 'tasks/:groupId', component: TasksComponent },
  { path: 'profile', component: ProfileComponent },
  { path: '**', redirectTo: '' }
];