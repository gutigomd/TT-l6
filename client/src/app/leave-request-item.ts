import { Component, computed, input, output } from '@angular/core';
import { LeaveRequest, calculateCalendarDays } from './leave-request';

@Component({
  selector: 'app-leave-request-item',
  standalone: true,
  template: `
    <article>
      <div>
        <strong>{{ item().employeeName }} ({{ item().requestCode }})</strong>
        <p>Підрозділ: {{ item().department }} · Тип: {{ item().leaveType }}</p>
        <p>Період: {{ item().startDate }} — {{ item().endDate }} ({{ days() }} дн.)</p>
      </div>
      <button
        type="button"
        [disabled]="disabled()"
        [attr.aria-label]="'Видалити заявку ' + item().requestCode"
        (click)="removed.emit(item())"
      >
        Видалити
      </button>
    </article>
  `
})
export class LeaveRequestItemComponent {
  readonly item = input.required<LeaveRequest>();
  readonly disabled = input(false);
  readonly removed = output<LeaveRequest>();

  readonly days = computed(() =>
    calculateCalendarDays(this.item().startDate, this.item().endDate)
  );
}
