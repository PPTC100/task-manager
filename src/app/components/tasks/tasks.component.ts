import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { StorageService } from '../../services/storage.service';
import { GroupService } from '../../services/group.service';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-tasks',
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
    MatExpansionModule,
    MatSelectModule
  ],
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit {
  groupId: string | null = null;
  group: any = null;
  tasks: any[] = [];
  newTaskName = '';
  newTaskAssignedTo: string[] = [];
  newTaskTags = '';
  members: { id: string, username: string }[] = [];
  taskAssignments: { [taskId: string]: string } = {};

  constructor(
    private route: ActivatedRoute,
    private storageService: StorageService,
    private groupService: GroupService
  ) {}

  ngOnInit() {
    this.groupId = this.route.snapshot.paramMap.get('groupId');
    if (this.groupId) {
      const data = this.storageService.getData();
      this.group = data.groups.find((g: any) => g.id === this.groupId);
      this.tasks = this.group?.tasks || [];
      this.members = this.group?.members?.map((memberId: string) => {
        const user = data.users.find((u: any) => u.id === memberId);
        return user ? { id: user.id, username: user.username } : { id: memberId, username: 'Nieznany użytkownik' };
      }) || [];
      this.tasks.forEach(task => {
        if (typeof task.assignedTo === 'string') {
          task.assignedTo = task.assignedTo ? [task.assignedTo] : [];
        }
        const assignedMembers = this.members.filter(m => task.assignedTo?.includes(m.id));
        this.taskAssignments[task.id] = assignedMembers.map(m => m.username).join(', ') || '';
      });
    }
  }

  createTask() {
    if (!this.newTaskName.trim()) {
      alert('Nazwa zadania nie może być pusta!');
      return;
    }
    const data = this.storageService.getData();
    const group = data.groups.find((g: any) => g.id === this.groupId);
    const newTask = {
      id: 't' + Date.now(),
      name: this.newTaskName,
      assignedTo: this.newTaskAssignedTo || [],
      tags: this.newTaskTags ? this.newTaskTags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag) : []
    };
    group.tasks.push(newTask);
    this.storageService.saveData(data);
    this.tasks = group.tasks;
    const assignedMembers = this.members.filter(m => newTask.assignedTo.includes(m.id));
    this.taskAssignments[newTask.id] = assignedMembers.map(m => m.username).join(', ') || '';
    this.newTaskName = '';
    this.newTaskAssignedTo = [];
    this.newTaskTags = '';
  }

  updateTask(task: any) {
    if (!task.name.trim()) {
      alert('Nazwa zadania nie może być pusta!');
      return;
    }
    const data = this.storageService.getData();
    const group = data.groups.find((g: any) => g.id === this.groupId);
    const taskToUpdate = group.tasks.find((t: any) => t.id === task.id);
    taskToUpdate.name = task.name;
    taskToUpdate.assignedTo = task.assignedTo || [];
    taskToUpdate.tags = task.tagsString ? task.tagsString.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag) : [];
    this.storageService.saveData(data);
    this.tasks = group.tasks;
    const assignedMembers = this.members.filter(m => task.assignedTo.includes(m.id));
    this.taskAssignments[task.id] = assignedMembers.map(m => m.username).join(', ') || '';
    delete task.tagsString;
  }

  deleteTask(taskId: string) {
    if (!confirm('Czy na pewno chcesz usunąć to zadanie?')) return;
    const data = this.storageService.getData();
    const group = data.groups.find((g: any) => g.id === this.groupId);
    group.tasks = group.tasks.filter((t: any) => t.id !== taskId);
    this.storageService.saveData(data);
    this.tasks = group.tasks;
    delete this.taskAssignments[taskId];
  }

  getMemberNames() {
    return this.members;
  }

  getAssignedMemberName(taskId: string): string {
    return this.taskAssignments[taskId] || '';
  }
}
