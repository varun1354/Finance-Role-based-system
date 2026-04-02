import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { EmployeeRecord, UserRecord } from '../../../core/models/user.models';
import { AuthService } from '../../../core/services/auth.service';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-employee-dashboard',
  standalone: false,
  templateUrl: './employee-dashboard.component.html'
})
export class EmployeeDashboardComponent implements OnInit {
  record: EmployeeRecord | null = null;
  fallbackUser: UserRecord | null = null;
  errorMessage = '';
  readonly greeting = `Hey, ${this.authService.getUserName()}!`;

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    const userId = this.authService.getUserId();

    if (!userId) {
      return;
    }

    this.userService.getEmployeeByUserId(userId).subscribe({
      next: (record) => {
        this.record = record;
      },
      error: () => {
        this.userService.getUserById(userId).subscribe({
          next: (user) => {
            this.fallbackUser = user;
            this.errorMessage = 'Your employee profile is not linked yet, so only your basic account info is available.';
          },
          error: () => {
            this.errorMessage = 'Unable to load your employee record from the backend.';
          }
        });
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }
}
