export type LeaveType = 'щорічна' | 'навчальна' | 'інша';

export interface LeaveRequest {
  id: string;
  requestCode: string;
  employeeName: string;
  department: string;
  startDate: string;
  endDate: string;
  leaveType: LeaveType;
}

export type LeaveRequestInput = Omit<LeaveRequest, 'id'>;

export function calculateCalendarDays(startDate: string, endDate: string): number {
  const start = parseIsoDateLocal(startDate);
  const end = parseIsoDateLocal(endDate);
  if (!start || !end) return 0;
  const diffDays = Math.round((end.getTime() - start.getTime()) / 86_400_000);
  return diffDays >= 0 ? diffDays + 1 : 0;
}

function parseIsoDateLocal(iso: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim());
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const dt = new Date(year, month - 1, day);
  if (dt.getFullYear() !== year || dt.getMonth() !== month - 1 || dt.getDate() !== day) {
    return null;
  }
  return dt;
}
