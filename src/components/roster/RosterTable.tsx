import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ViewType, Employee, Shift, RosterAssignment, ShiftType } from "@/pages/EmployeeRoster";
import { format, addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import { ShiftConflictsAlert } from "./ShiftConflictsAlert";
import { detectShiftConflicts } from "@/utils/shiftConflicts";

interface RosterTableProps {
  viewType: ViewType;
  currentDate: Date;
  selectedEmployees: string[];
  rosterData: RosterAssignment[];
  onRosterUpdate: (assignments: RosterAssignment[]) => void;
}

// Mock data for demonstration
const mockEmployees: Employee[] = [
  { id: "1", name: "John Smith", department: "Kitchen", designation: "Chef" },
  { id: "2", name: "Sarah Johnson", department: "Service", designation: "Waitress" },
  { id: "3", name: "Mike Wilson", department: "Kitchen", designation: "Cook" },
  { id: "4", name: "Emily Brown", department: "Service", designation: "Cashier" },
  { id: "5", name: "David Lee", department: "Management", designation: "Supervisor" },
  { id: "6", name: "Lisa Garcia", department: "Service", designation: "Waitress" },
];

const mockShifts: Shift[] = [
  { id: "1", code: "AM", label: "Morning", startTime: "06:00", endTime: "14:00", duration: 8, graceMinutes: 15 },
  { id: "2", code: "PM", label: "Evening", startTime: "14:00", endTime: "22:00", duration: 8, graceMinutes: 15 },
  { id: "3", code: "MID", label: "Night", startTime: "22:00", endTime: "06:00", duration: 8, graceMinutes: 15 },
  { id: "4", code: "STRAIGHT", label: "Full Day", startTime: "08:00", endTime: "20:00", duration: 12, graceMinutes: 30 },
];

export const RosterTable = ({
  viewType,
  currentDate,
  rosterData,
  onRosterUpdate,
}: RosterTableProps) => {
  const [assignments, setAssignments] = useState<RosterAssignment[]>(rosterData);

  const getDatesForView = () => {
    switch (viewType) {
      case "daily":
        return [currentDate];
      case "weekly":
        return eachDayOfInterval({
          start: startOfWeek(currentDate),
          end: endOfWeek(currentDate)
        });
      case "monthly":
        return eachDayOfInterval({
          start: startOfMonth(currentDate),
          end: endOfMonth(currentDate)
        });
    }
  };

  const dates = getDatesForView();

  const getShiftForEmployee = (employeeId: string, date: Date): ShiftType | "OFF" => {
    const dateStr = format(date, "yyyy-MM-dd");
    const assignment = assignments.find(
      a => a.employeeId === employeeId && a.date === dateStr
    );
    
    if (assignment?.isOffDay || assignment?.leaveType) return "OFF";
    if (assignment?.shiftId) {
      const shift = mockShifts.find(s => s.id === assignment.shiftId);
      return shift?.code || "OFF";
    }
    return "OFF";
  };

  const updateAssignment = (employeeId: string, date: Date, shiftCode: ShiftType | "OFF") => {
    const dateStr = format(date, "yyyy-MM-dd");
    const existingIndex = assignments.findIndex(
      a => a.employeeId === employeeId && a.date === dateStr
    );

    const newAssignment: RosterAssignment = {
      employeeId,
      date: dateStr,
      isOffDay: shiftCode === "OFF",
      shiftId: shiftCode !== "OFF" ? mockShifts.find(s => s.code === shiftCode)?.id : undefined,
    };

    let newAssignments;
    if (existingIndex >= 0) {
      newAssignments = [...assignments];
      newAssignments[existingIndex] = newAssignment;
    } else {
      newAssignments = [...assignments, newAssignment];
    }

    setAssignments(newAssignments);
    onRosterUpdate(newAssignments);
  };

  const getShiftBadgeVariant = (shift: ShiftType | "OFF") => {
    switch (shift) {
      case "AM": return "default";
      case "PM": return "secondary";
      case "MID": return "destructive";
      case "STRAIGHT": return "outline";
      case "OFF": return "destructive";
      default: return "outline";
    }
  };

  const getShiftColor = (shift: ShiftType | "OFF") => {
    switch (shift) {
      case "AM": return "bg-blue-100 text-blue-800";
      case "PM": return "bg-green-100 text-green-800";
      case "MID": return "bg-purple-100 text-purple-800";
      case "STRAIGHT": return "bg-orange-100 text-orange-800";
      case "OFF": return "bg-gray-100 text-gray-600";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  useEffect(() => {
    setAssignments(rosterData);
  }, [rosterData]);

  // Detect conflicts in current assignments
  const conflicts = detectShiftConflicts(assignments);

  return (
    <>
      <ShiftConflictsAlert conflicts={conflicts} />
      <Card>
        <CardHeader>
          <CardTitle>Roster Assignment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-48">Employee</TableHead>
                  <TableHead className="w-32">Department</TableHead>
                  {dates.map((date) => (
                    <TableHead key={date.toISOString()} className="text-center min-w-24">
                      <div className="flex flex-col">
                        <span className="font-semibold">{format(date, "EEE")}</span>
                        <span className="text-xs text-gray-500">{format(date, "MM/dd")}</span>
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockEmployees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell className="font-medium">
                      <div>
                        <div className="font-semibold">{employee.name}</div>
                        <div className="text-sm text-gray-500">{employee.designation}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{employee.department}</Badge>
                    </TableCell>
                    {dates.map((date) => {
                      const currentShift = getShiftForEmployee(employee.id, date);
                      return (
                        <TableCell key={`${employee.id}-${date.toISOString()}`} className="text-center p-2">
                          <Select
                            value={currentShift}
                            onValueChange={(value: ShiftType | "OFF") => 
                              updateAssignment(employee.id, date, value)
                            }
                          >
                            <SelectTrigger className={`w-20 h-8 text-xs ${getShiftColor(currentShift)}`}>
                              <SelectValue>
                                <span className="font-semibold">{currentShift}</span>
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="OFF">OFF</SelectItem>
                              {mockShifts.map((shift) => (
                                <SelectItem key={shift.id} value={shift.code}>
                                  <div className="flex flex-col text-left">
                                    <span className="font-semibold">{shift.code}</span>
                                    <span className="text-xs text-gray-500">
                                      {shift.startTime}-{shift.endTime}
                                    </span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </>
  );
};
