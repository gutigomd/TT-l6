import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { LeaveRequestsApiService } from './leave-requests-api.service';
import { LeaveRequest, LeaveRequestInput, calculateCalendarDays } from './leave-request';
import { LeaveRequestFormComponent } from './leave-request-form';
import { LeaveRequestItemComponent } from './leave-request-item';
import { apiError } from './api-error';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LeaveRequestFormComponent, LeaveRequestItemComponent],
  templateUrl: './app.html'
})
export class App implements OnInit {
  private readonly api = inject(LeaveRequestsApiService);

  readonly requests = signal<LeaveRequest[]>([]);
  readonly pending = signal(false);
  readonly loading = signal(false);
  readonly error = signal('');
  readonly message = signal('');
  readonly resetToken = signal(0);

  readonly query = signal('');
  readonly selectedDepartment = signal('');

  readonly departments = computed(() => {
    const unique = new Set(this.requests().map(r => r.department.trim()).filter(Boolean));
    return Array.from(unique).sort((a, b) => a.localeCompare(b, 'uk-UA'));
  });

  readonly visible = computed(() => {
    const q = this.query().trim().toLocaleLowerCase('uk-UA');
    const dept = this.selectedDepartment();

    const filtered = this.requests().filter(item => {
      const matchesEmployee = item.employeeName.toLocaleLowerCase('uk-UA').includes(q);
      const matchesDept = !dept || item.department === dept;
      return matchesEmployee && matchesDept;
    });

    return [...filtered].sort((a, b) => a.startDate.localeCompare(b.startDate));
  });

  readonly totalDays = computed(() =>
    this.visible().reduce((sum, item) => sum + calculateCalendarDays(item.startDate, item.endDate), 0)
  );

  ngOnInit(): void {
    void this.load();
  }

  async load(): Promise<void> {
    if (this.pending()) return;
    this.pending.set(true);
    this.loading.set(true);
    this.error.set('');
    this.message.set('');

    try {
      const rows = await firstValueFrom(this.api.list());
      if (!Array.isArray(rows)) {
        throw new Error('API не повернуло масив.');
      }
      this.requests.set(rows);
    } catch (err) {
      this.error.set(apiError(err));
    } finally {
      this.loading.set(false);
      this.pending.set(false);
    }
  }

  async add(input: LeaveRequestInput): Promise<void> {
    if (this.pending()) return;
    this.pending.set(true);
    this.error.set('');
    this.message.set('');

    try {
      const created = await firstValueFrom(this.api.add(input));
      this.requests.update(rows => [...rows, created]);
      this.resetToken.update(value => value + 1);
      this.message.set('Заявку додано.');
    } catch (err) {
      this.error.set(apiError(err));
    } finally {
      this.pending.set(false);
    }
  }

  async remove(item: LeaveRequest): Promise<void> {
    if (this.pending() || !window.confirm(`Видалити заявку ${item.requestCode} (${item.employeeName})?`)) {
      return;
    }

    this.pending.set(true);
    this.error.set('');
    this.message.set('');

    try {
      await firstValueFrom(this.api.remove(item.id));
      this.requests.update(rows => rows.filter(r => r.id !== item.id));
      this.message.set('Заявку видалено.');
    } catch (err) {
      this.error.set(apiError(err));
    } finally {
      this.pending.set(false);
    }
  }
}
