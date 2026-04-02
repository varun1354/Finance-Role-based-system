import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserRecord } from '../../../core/models/user.models';
import { AuthService } from '../../../core/services/auth.service';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-client-dashboard',
  standalone: false,
  templateUrl: './client-dashboard.component.html'
})
export class ClientDashboardComponent implements OnInit {
  client: UserRecord | null = null;
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

    this.userService.getUserById(userId).subscribe({
      next: (user) => {
        this.client = user;
      },
      error: () => {
        this.errorMessage = 'Unable to load your client record from the backend.';
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }
}
