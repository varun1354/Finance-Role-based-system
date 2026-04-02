import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  DashboardSummary,
  DashboardTrends,
  EmployeeRecord,
  FinancialRecord,
  LoginActivityRecord,
  UserRecord
} from '../models/user.models';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface PaginatedApiResponse<T> extends ApiResponse<T> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly baseUrl = environment.apiBaseUrl;

  constructor(private readonly http: HttpClient) {}

  getAllUsers(): Observable<UserRecord[]> {
    return this.http
      .get<ApiResponse<UserRecord[]>>(`${this.baseUrl}/users`)
      .pipe(map((response) => response.data ?? []));
  }

  getUserById(id: number): Observable<UserRecord> {
    return this.http
      .get<ApiResponse<UserRecord>>(`${this.baseUrl}/users/${id}`)
      .pipe(map((response) => response.data));
  }

  updateUser(id: number, payload: Partial<UserRecord>): Observable<UserRecord> {
    return this.http
      .put<ApiResponse<UserRecord>>(`${this.baseUrl}/users/${id}`, payload)
      .pipe(map((response) => response.data));
  }

  getEmployees(): Observable<EmployeeRecord[]> {
    const params = new HttpParams().set('_', Date.now().toString());

    return this.http
      .get<ApiResponse<EmployeeRecord[]>>(`${this.baseUrl}/employees`, { params })
      .pipe(map((response) => response.data ?? []));
  }

  getEmployeeByUserId(userId: number): Observable<EmployeeRecord> {
    const params = new HttpParams().set('_', Date.now().toString());

    return this.http
      .get<ApiResponse<EmployeeRecord>>(`${this.baseUrl}/employees/${userId}`, { params })
      .pipe(map((response) => response.data));
  }

  getLoginActivity(): Observable<LoginActivityRecord[]> {
    return this.http
      .get<ApiResponse<LoginActivityRecord[]>>(`${this.baseUrl}${environment.loginActivityPath}`)
      .pipe(
        map((response) => response.data ?? []),
        catchError(() => of([]))
      );
  }

  getRecords(): Observable<FinancialRecord[]> {
    return this.http
      .get<PaginatedApiResponse<FinancialRecord[]>>(`${this.baseUrl}/records`)
      .pipe(map((response) => response.data ?? []));
  }

  getDashboardSummary(userId?: number): Observable<DashboardSummary> {
    let params = new HttpParams();

    if (userId !== undefined) {
      params = params.set('user_id', userId.toString());
    }

    return this.http
      .get<ApiResponse<DashboardSummary>>(`${this.baseUrl}/dashboard/summary`, { params })
      .pipe(map((response) => response.data));
  }

  getDashboardTrends(): Observable<DashboardTrends> {
    return this.http
      .get<ApiResponse<DashboardTrends>>(`${this.baseUrl}/dashboard/trends`)
      .pipe(map((response) => response.data));
  }
}
