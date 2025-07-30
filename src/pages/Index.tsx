
import { DashboardLayout } from "@/components/DashboardLayout";
import { DashboardCards } from "@/components/DashboardCards";
import { LeaveSection } from "@/components/LeaveSection";
import { EmployeeSection } from "@/components/EmployeeSection";
import { BirthdaySection } from "@/components/BirthdaySection";

const Index = () => {
  console.log("Index component rendering...");
  
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">DASHBOARD</h1>
            <p className="text-gray-600 mt-1">Welcome back, here's what's happening today</p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              View Calendar
            </button>
            <div className="flex items-center space-x-2">
              <button className="bg-green-600 text-white px-3 py-1 rounded-full text-sm">
                Time In
              </button>
              <span className="text-sm text-gray-600">(HH/MM/SS)</span>
              <button className="bg-red-600 text-white px-3 py-1 rounded-full text-sm">
                Time Out
              </button>
              <span className="text-sm text-gray-600">(HH/MM/SS)</span>
            </div>
          </div>
        </div>

        {/* Dashboard Cards */}
        <DashboardCards />

        {/* Content Sections */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <LeaveSection />
          <EmployeeSection />
        </div>

        {/* Birthday Section */}
        <BirthdaySection />
      </div>
    </DashboardLayout>
  );
};

export default Index;
