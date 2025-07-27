
import { Users, UserCheck, UserX, Clock } from "lucide-react";

const cardData = [
  {
    title: "Employees",
    value: "51",
    icon: Users,
    color: "bg-blue-500",
    bgColor: "bg-blue-50"
  },
  {
    title: "Interns",
    value: "0",
    icon: UserCheck,
    color: "bg-green-500",
    bgColor: "bg-green-50"
  },
  {
    title: "Employees on leave (Today)",
    value: "0",
    icon: UserX,
    color: "bg-red-500",
    bgColor: "bg-red-50"
  },
  {
    title: "Pending Leave Requests",
    value: "10",
    icon: Clock,
    color: "bg-yellow-500",
    bgColor: "bg-yellow-50"
  }
];

export const DashboardCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cardData.map((card, index) => (
        <div
          key={index}
          className={`${card.bgColor} rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
              <p className="text-3xl font-bold text-gray-900">{card.value}</p>
            </div>
            <div className={`${card.color} p-3 rounded-lg`}>
              <card.icon className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
