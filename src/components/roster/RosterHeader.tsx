
import { CalendarIcon, ChevronLeft, ChevronRight, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ViewType } from "@/pages/EmployeeRoster";
import { Badge } from "@/components/ui/badge";
import { format, addDays, addWeeks, addMonths, subDays, subWeeks, subMonths } from "date-fns";

interface RosterHeaderProps {
  viewType: ViewType;
  onViewTypeChange: (view: ViewType) => void;
  currentDate: Date;
  onDateChange: (date: Date) => void;
  selectedEmployees: string[];
  onEmployeeSelection: (employees: string[]) => void;
}

export const RosterHeader = ({
  viewType,
  onViewTypeChange,
  currentDate,
  onDateChange,
  selectedEmployees,
}: RosterHeaderProps) => {
  const getDateLabel = () => {
    switch (viewType) {
      case "daily":
        return format(currentDate, "EEEE, MMMM d, yyyy");
      case "weekly":
        return `Week of ${format(currentDate, "MMM d, yyyy")}`;
      case "monthly":
        return format(currentDate, "MMMM yyyy");
    }
  };

  const navigateDate = (direction: "prev" | "next") => {
    switch (viewType) {
      case "daily":
        onDateChange(direction === "next" ? addDays(currentDate, 1) : subDays(currentDate, 1));
        break;
      case "weekly":
        onDateChange(direction === "next" ? addWeeks(currentDate, 1) : subWeeks(currentDate, 1));
        break;
      case "monthly":
        onDateChange(direction === "next" ? addMonths(currentDate, 1) : subMonths(currentDate, 1));
        break;
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <CalendarIcon className="h-5 w-5 text-gray-500" />
              <span className="text-lg font-semibold">{getDateLabel()}</span>
            </div>
            
            <div className="flex items-center space-x-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateDate("prev")}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateDate("next")}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                {selectedEmployees.length} employees selected
              </span>
            </div>

            <div className="flex rounded-lg border p-1">
              {(["daily", "weekly", "monthly"] as ViewType[]).map((view) => (
                <Button
                  key={view}
                  variant={viewType === view ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onViewTypeChange(view)}
                  className="capitalize"
                >
                  {view}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
