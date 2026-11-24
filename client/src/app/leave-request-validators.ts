import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { calculateCalendarDays } from './leave-request';

export function trimmedLength(min: number, max: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = String(control.value ?? '').trim();
    return value.length >= min && value.length <= max
      ? null
      : { trimmedLength: { min, max } };
  };
}

export const dateRangeValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  const start = String(group.get('startDate')?.value ?? '').trim();
  const end = String(group.get('endDate')?.value ?? '').trim();
  const leaveType = String(group.get('leaveType')?.value ?? '').trim();

  if (!start || !end) {
    return null;
  }

  if (end < start) {
    return { endBeforeStart: true };
  }

  const days = calculateCalendarDays(start, end);
  if (leaveType === 'навчальна' && (days < 1 || days > 60)) {
    return { educationalDaysRange: true };
  }

  return null;
};
