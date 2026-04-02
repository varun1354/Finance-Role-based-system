import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, forkJoin, of } from 'rxjs';

import { DashboardSummary, UserRecord } from '../../../core/models/user.models';
import { AuthService } from '../../../core/services/auth.service';
import { UserService } from '../../../core/services/user.service';

interface DirectoryRow {
  id: number;
  name: string;
  email: string;
  department: string;
  designation: string;
  phone: string;
  role: string;
  status: string;
  isUpdating: boolean;
  isOverviewOpen: boolean;
  isOverviewLoading: boolean;
  overviewError: string;
  overview: DashboardSummary | null;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: false,
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  directoryRows: DirectoryRow[] = [];
  users: UserRecord[] = [];
  isLoading = true;
  errorMessage = '';
  employeeCount = 0;
  analystCount = 0;
  inactiveCount = 0;
  readonly greeting = `Hey, ${this.authService.getUserName()}!`;

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly router: Router,
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    forkJoin({
      users: this.userService.getAllUsers(),
      employees: this.userService.getEmployees().pipe(
        catchError(() => {
          this.errorMessage = 'Employee profiles could not be loaded, so the directory is showing basic user data only.';
          return of([]);
        })
      )
    }).subscribe({
      next: ({ users, employees }) => {
        this.users = users;
        this.employeeCount = users.filter((user) => user.role === 'employee').length;
        this.analystCount = users.filter((user) => user.role === 'analyst').length;
        this.inactiveCount = users.filter((user) => user.status === 'inactive').length;

        const employeeMap = new Map(
          employees.map((employee) => [
            employee.email,
            {
              department: employee.department || 'N/A',
              designation: employee.designation || 'N/A',
              phone: employee.phone || 'N/A',
              employmentStatus: employee.status || 'N/A'
            }
          ])
        );

        this.directoryRows = this.users.map((user) => {
          const employeeDetails = employeeMap.get(user.email);

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            department: employeeDetails?.department || 'N/A',
            designation: employeeDetails?.designation || 'N/A',
            phone: employeeDetails?.phone || user.phone || 'N/A',
            role: user.role,
            status: user.status || employeeDetails?.employmentStatus || 'active',
            isUpdating: false,
            isOverviewOpen: false,
            isOverviewLoading: false,
            overviewError: '',
            overview: null
          };
        });
        this.isLoading = false;
        this.changeDetectorRef.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Unable to load dashboard data from the backend.';
        this.isLoading = false;
        this.changeDetectorRef.detectChanges();
      }
    });
  }

  getCurrentUserId(): number | null {
    return this.authService.getUserId();
  }

  formatCurrency(amount: number | undefined): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(amount ?? 0);
  }

  toggleFinancialOverview(row: DirectoryRow): void {
    row.isOverviewOpen = !row.isOverviewOpen;

    if (!row.isOverviewOpen || row.overview || row.isOverviewLoading) {
      return;
    }

    row.isOverviewLoading = true;
    row.overviewError = '';

    this.userService.getDashboardSummary(row.id).subscribe({
      next: (summary) => {
        row.overview = summary;
        row.isOverviewLoading = false;
        this.changeDetectorRef.detectChanges();
      },
      error: () => {
        row.overviewError = 'Unable to load financial overview for this employee.';
        row.isOverviewLoading = false;
        this.changeDetectorRef.detectChanges();
      }
    });
  }

  toggleUserStatus(row: DirectoryRow): void {
    if (row.isUpdating || row.id === this.getCurrentUserId()) {
      return;
    }

    const nextStatus = row.status === 'active' ? 'inactive' : 'active';
    row.isUpdating = true;
    this.errorMessage = '';

    this.userService.updateUser(row.id, { status: nextStatus }).subscribe({
      next: (updatedUser) => {
        row.status = updatedUser.status || nextStatus;
        row.isUpdating = false;

        const userIndex = this.users.findIndex((user) => user.id === row.id);

        if (userIndex >= 0) {
          this.users[userIndex] = updatedUser;
        }

        this.inactiveCount = this.users.filter((user) => user.status === 'inactive').length;
        this.changeDetectorRef.detectChanges();
      },
      error: () => {
        row.isUpdating = false;
        this.errorMessage = `Unable to update status for ${row.name}.`;
        this.changeDetectorRef.detectChanges();
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }
}
