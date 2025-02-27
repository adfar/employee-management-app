export type TimeSchedule = {
  start: string;
  end: string;
};

export type EmployeeStatus = 
  | 'idle'        // Not clocked in
  | 'active'      // Clocked in and working
  | 'break1'      // On first break
  | 'lunch'       // On lunch
  | 'break2'      // On second break
  | 'completed'   // Clocked out for the day
  | 'tardy'       // Marked as tardy
  | 'absent';     // Marked as absent

export interface Employee {
  id: string;
  name: string;
  shift: TimeSchedule;
  break1: TimeSchedule;
  lunch: TimeSchedule;
  break2: TimeSchedule;
  status: EmployeeStatus;
  statusHistory: Array<{
    status: EmployeeStatus;
    timestamp: number;
  }>;
}

export type Mode = 'edit' | 'manage';