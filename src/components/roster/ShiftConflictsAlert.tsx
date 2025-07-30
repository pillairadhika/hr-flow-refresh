
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";
import { ShiftConflict } from "@/utils/shiftConflicts";
import { format } from "date-fns";

interface ShiftConflictsAlertProps {
  conflicts: ShiftConflict[];
}

export const ShiftConflictsAlert = ({ conflicts }: ShiftConflictsAlertProps) => {
  if (conflicts.length === 0) return null;

  const getConflictMessage = (conflict: ShiftConflict) => {
    const formattedDate = format(new Date(conflict.date), "MMM dd, yyyy");
    const shiftCodes = conflict.shifts.map(s => s.shiftCode).join(", ");
    
    if (conflict.conflictType === "overlapping_shifts") {
      return `${conflict.employeeName} has overlapping shifts on ${formattedDate}: ${shiftCodes}`;
    } else {
      return `${conflict.employeeName} has multiple shifts on ${formattedDate}: ${shiftCodes}`;
    }
  };

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Shift Conflicts Detected</AlertTitle>
      <AlertDescription>
        <div className="mt-2 space-y-2">
          {conflicts.map((conflict, index) => (
            <div key={`${conflict.employeeId}-${conflict.date}-${index}`} className="flex items-center justify-between">
              <span className="text-sm">{getConflictMessage(conflict)}</span>
              <Badge variant="destructive" className="ml-2">
                {conflict.conflictType === "overlapping_shifts" ? "Overlap" : "Multiple"}
              </Badge>
            </div>
          ))}
        </div>
      </AlertDescription>
    </Alert>
  );
};
