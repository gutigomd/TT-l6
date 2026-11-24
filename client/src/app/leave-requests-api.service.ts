import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, timeout } from 'rxjs';
import { LeaveRequest, LeaveRequestInput } from './leave-request';

@Injectable({ providedIn: 'root' })
export class LeaveRequestsApiService {
  private readonly http = inject(HttpClient);
  private readonly url = '/api/leaverequests';

  list(): Observable<LeaveRequest[]> {
    return this.http.get<LeaveRequest[]>(this.url).pipe(timeout(10000));
  }

  add(input: LeaveRequestInput): Observable<LeaveRequest> {
    return this.http.post<LeaveRequest>(this.url, input).pipe(timeout(10000));
  }

  remove(id: string): Observable<LeaveRequest> {
    const targetUrl = `${this.url}/${encodeURIComponent(id)}`;
    return this.http.delete<LeaveRequest>(targetUrl).pipe(timeout(10000));
  }
}
