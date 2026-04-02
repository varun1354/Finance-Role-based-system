import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, forkJoin, of } from 'rxjs';

import { DashboardSummary, UserRecord } from '../../../core/models/user.models';
import { AuthService } from '../../../core/services/auth.service';
import { UserService } from '../../../core/services/user.service';

interface HrRow {
  id: number;
  name: string;
  email: string;
  department: string;
  designation: string;
  phone: string;
  role: string;
  status: string;
  isOverviewOpen: boolean;
  isOverviewLoading: boolean;
  overviewError: string;
  overview: DashboardSummary | null;
}

@Component({
  selector: 'app-analyst-dashboard',
  standalone: false,
  templateUrl: './analyst-dashboard.component.html'
})
export class AnalystDashboardComponent implements OnInit {
  rows: HrRow[] = [];
  employeeCount = 0;
  inactiveCount = 0;
  errorMessage = '';
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
          this.errorMessage = 'Employee details could not be loaded completely, so the directory is showing basic employee data where needed.';
          return of([]);
        })
      )
    }).subscribe({
      next: ({ users, employees }) => {
        const employeeUsers = users.filter((user: UserRecord) => user.role === 'employee');
        const employeeMap = new Map(
          employees.map((employee) => [
            employee.email,
            {
              department: employee.department || 'N/A',
              designation: employee.designation || 'N/A',
              phone: employee.phone || 'N/A',
              status: employee.status || 'active'
            }
          ])
        );

        this.rows = employeeUsers.map((user) => {
          const employeeDetails = employeeMap.get(user.email);

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            department: employeeDetails?.department || 'N/A',
            designation: employeeDetails?.designation || 'N/A',
            phone: employeeDetails?.phone || user.phone || 'N/A',
            role: user.role,
            status: user.status || employeeDetails?.status || 'active',
            isOverviewOpen: false,
            isOverviewLoading: false,
            overviewError: '',
            overview: null
          };
        });

        this.employeeCount = this.rows.length;
        this.inactiveCount = this.rows.filter((row) => row.status === 'inactive').length;
        this.changeDetectorRef.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Unable to load user records from the backend.';
        this.changeDetectorRef.detectChanges();
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }

  formatCurrency(amount: number | undefined): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(amount ?? 0);
  }

  toggleFinancialOverview(row: HrRow): void {
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
}
