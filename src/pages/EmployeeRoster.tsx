
import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { RosterTable } from "@/components/roster/RosterTable";
import { RosterHeader } from "@/components/roster/RosterHeader";
import { RosterSummary } from "@/components/roster/RosterSummary";

export type ViewType = "daily" | "weekly" | "monthly";
export type ShiftType = "AM" | "PM" | "MID" | "STRAIGHT" | "OFF";

export interface Employee {
  id: string;
  name: string;
  department: string;
  designation: string;
}

export interface Shift {
  id: string;
  code: ShiftType;
  label: string;
  startTime: string;
  endTime: string;
  duration: number;
  graceMinutes: number;
}

export interface RosterAssignment {
  employeeId: string;
  date: string;
  shiftId?: string;
  isOffDay: boolean;
  leaveType?: "ANNUAL" | "UNPAID";
}

const EmployeeRoster = () => {
  const [viewType, setViewType] = useState<ViewType>("weekly");
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [rosterData, setRosterData] = useState<RosterAssignment[]>([]);

  const handleRosterUpdate = (assignments: RosterAssignment[]) => {
    setRosterData(assignments);
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Employee Roster</h1>
        </div>
        
        <RosterHeader
          viewType={viewType}
          onViewTypeChange={setViewType}
          currentDate={currentDate}
          onDateChange={setCurrentDate}
          selectedEmployees={selectedEmployees}
          onEmployeeSelection={setSelectedEmployees}
        />

        <RosterTable
          viewType={viewType}
          currentDate={currentDate}
          selectedEmployees={selectedEmployees}
          rosterData={rosterData}
          onRosterUpdate={handleRosterUpdate}
        />

        <RosterSummary
          rosterData={rosterData}
          viewType={viewType}
          currentDate={currentDate}
        />
      </div>
    </DashboardLayout>
  );
};

export default EmployeeRoster;
