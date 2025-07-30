
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ViewType, RosterAssignment, ShiftType } from "@/pages/EmployeeRoster";
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";

interface RosterSummaryProps {
  rosterData: RosterAssignment[];
  viewType: ViewType;
  currentDate: Date;
}

const mockShifts = [
  { id: "1", code: "AM", label: "Morning", startTime: "06:00", endTime: "14:00" },
  { id: "2", code: "PM", label: "Evening", startTime: "14:00", endTime: "22:00" },
  { id: "3", code: "MID", label: "Night", startTime: "22:00", endTime: "06:00" },
  { id: "4", code: "STRAIGHT", label: "Full Day", startTime: "08:00", endTime: "20:00" },
];

export const RosterSummary = ({ rosterData, viewType, currentDate }: RosterSummaryProps) => {
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
  const dateStrings = dates.map(date => format(date, "yyyy-MM-dd"));

  const getShiftSummary = () => {
    const summary: Record<string, number> = {
      "AM": 0,
      "PM": 0,
      "MID": 0,
      "STRAIGHT": 0,
      "OFF": 0,
    };

    dateStrings.forEach(dateStr => {
      const dayAssignments = rosterData.filter(assignment => assignment.date === dateStr);
      
      dayAssignments.forEach(assignment => {
        if (assignment.isOffDay || assignment.leaveType) {
          summary["OFF"]++;
        } else if (assignment.shiftId) {
          const shift = mockShifts.find(s => s.id === assignment.shiftId);
          if (shift) {
            summary[shift.code as keyof typeof summary]++;
          }
        }
      });
    });

    return summary;
  };

  const summary = getShiftSummary();
  const totalAssignments = Object.values(summary).reduce((sum, count) => sum + count, 0);

  const getShiftColor = (shiftCode: string) => {
    switch (shiftCode) {
      case "AM": return "bg-blue-100 text-blue-800 border-blue-200";
      case "PM": return "bg-green-100 text-green-800 border-green-200";
      case "MID": return "bg-purple-100 text-purple-800 border-purple-200";
      case "STRAIGHT": return "bg-orange-100 text-orange-800 border-orange-200";
      case "OFF": return "bg-gray-100 text-gray-600 border-gray-200";
      default: return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Roster Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Object.entries(summary).map(([shiftCode, count]) => {
            const shift = mockShifts.find(s => s.code === shiftCode);
            const percentage = totalAssignments > 0 ? Math.round((count / totalAssignments) * 100) : 0;
            
            return (
              <div key={shiftCode} className="text-center">
                <div className={`p-3 rounded-lg border ${getShiftColor(shiftCode)}`}>
                  <div className="text-2xl font-bold">{count}</div>
                  <div className="text-sm font-semibold">{shiftCode}</div>
                  {shift && (
                    <div className="text-xs opacity-75">
                      {shift.startTime}-{shift.endTime}
                    </div>
                  )}
                  <div className="text-xs mt-1">{percentage}%</div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 pt-4 border-t">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Total Assignments:</span>
            <span className="font-semibold">{totalAssignments}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600 mt-1">
            <span>Period:</span>
            <span className="font-semibold capitalize">
              {viewType} - {dates.length} day{dates.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
