import { Component, input, OnChanges, output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LeaveRequestInput, LeaveType } from './leave-request';
import { dateRangeValidator, trimmedLength } from './leave-request-validators';

@Component({
  selector: 'app-leave-request-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './leave-request-form.html'
})
export class LeaveRequestFormComponent implements OnChanges {
  readonly disabled = input(false);
  readonly resetToken = input(0);
  readonly saved = output<LeaveRequestInput>();

  readonly leaveTypes: LeaveType[] = ['щорічна', 'навчальна', 'інша'];

  readonly form = new FormGroup(
    {
      requestCode: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, trimmedLength(2, 30)]
      }),
      employeeName: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, trimmedLength(2, 100)]
      }),
      department: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, trimmedLength(2, 100)]
      }),
      startDate: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required]
      }),
      endDate: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required]
      }),
      leaveType: new FormControl<LeaveType>('щорічна', {
        nonNullable: true,
        validators: [Validators.required]
      })
    },
    { validators: [dateRangeValidator] }
  );

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['resetToken'] && !changes['resetToken'].firstChange) {
      this.form.reset({
        requestCode: '',
        employeeName: '',
        department: '',
        startDate: '',
        endDate: '',
        leaveType: 'щорічна'
      });
    }
  }

  submit(): void {
    if (this.disabled()) return;
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    const raw = this.form.getRawValue();
    this.saved.emit({
      requestCode: raw.requestCode.trim(),
      employeeName: raw.employeeName.trim(),
      department: raw.department.trim(),
      startDate: raw.startDate,
      endDate: raw.endDate,
      leaveType: raw.leaveType
    });
  }
}
