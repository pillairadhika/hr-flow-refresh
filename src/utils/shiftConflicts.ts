
import { RosterAssignment } from "@/pages/EmployeeRoster";

export interface ShiftConflict {
  employeeId: string;
  employeeName: string;
  date: string;
  conflictType: "multiple_shifts" | "overlapping_shifts";
  shifts: Array<{
    shiftId: string;
    shiftCode: string;
    startTime: string;
    endTime: string;
  }>;
}

const mockShifts = [
  { id: "1", code: "AM", label: "Morning", startTime: "06:00", endTime: "14:00" },
  { id: "2", code: "PM", label: "Evening", startTime: "14:00", endTime: "22:00" },
  { id: "3", code: "MID", label: "Night", startTime: "22:00", endTime: "06:00" },
  { id: "4", code: "STRAIGHT", label: "Full Day", startTime: "08:00", endTime: "20:00" },
];

const mockEmployees = [
  { id: "1", name: "John Smith", department: "Kitchen", designation: "Chef" },
  { id: "2", name: "Sarah Johnson", department: "Service", designation: "Waitress" },
  { id: "3", name: "Mike Wilson", department: "Kitchen", designation: "Cook" },
  { id: "4", name: "Emily Brown", department: "Service", designation: "Cashier" },
  { id: "5", name: "David Lee", department: "Management", designation: "Supervisor" },
  { id: "6", name: "Lisa Garcia", department: "Service", designation: "Waitress" },
];

const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

const shiftsOverlap = (shift1: any, shift2: any): boolean => {
  const start1 = timeToMinutes(shift1.startTime);
  const end1 = timeToMinutes(shift1.endTime);
  const start2 = timeToMinutes(shift2.startTime);
  const end2 = timeToMinutes(shift2.endTime);

  // Handle overnight shifts (end time is less than start time)
  const adjustedEnd1 = end1 < start1 ? end1 + 24 * 60 : end1;
  const adjustedEnd2 = end2 < start2 ? end2 + 24 * 60 : end2;

  return start1 < adjustedEnd2 && start2 < adjustedEnd1;
};

export const detectShiftConflicts = (assignments: RosterAssignment[]): ShiftConflict[] => {
  const conflicts: ShiftConflict[] = [];
  
  // Group assignments by employee and date
  const employeeAssignments = assignments.reduce((acc, assignment) => {
    if (assignment.isOffDay || !assignment.shiftId) return acc;
    
    const key = `${assignment.employeeId}-${assignment.date}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(assignment);
    return acc;
  }, {} as Record<string, RosterAssignment[]>);

  // Check for conflicts
  Object.entries(employeeAssignments).forEach(([key, dayAssignments]) => {
    if (dayAssignments.length <= 1) return;

    const [employeeId, date] = key.split('-');
    const employee = mockEmployees.find(e => e.id === employeeId);
    if (!employee) return;

    const shifts = dayAssignments.map(assignment => {
      const shift = mockShifts.find(s => s.id === assignment.shiftId);
      return shift ? {
        shiftId: shift.id,
        shiftCode: shift.code,
        startTime: shift.startTime,
        endTime: shift.endTime,
      } : null;
    }).filter(Boolean) as any[];

    if (shifts.length > 1) {
      // Check if shifts overlap
      let hasOverlap = false;
      for (let i = 0; i < shifts.length; i++) {
        for (let j = i + 1; j < shifts.length; j++) {
          if (shiftsOverlap(shifts[i], shifts[j])) {
            hasOverlap = true;
            break;
          }
        }
        if (hasOverlap) break;
      }

      conflicts.push({
        employeeId,
        employeeName: employee.name,
        date,
        conflictType: hasOverlap ? "overlapping_shifts" : "multiple_shifts",
        shifts,
      });
    }
  });

  return conflicts;
};
