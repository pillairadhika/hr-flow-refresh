
import { 
  Home, 
  Settings, 
  Shield, 
  Star, 
  Cog, 
  User, 
  UserPlus, 
  Users, 
  Clock, 
  FileText, 
  Calendar,
  MapPin,
  Building,
  Briefcase,
  DollarSign,
  Archive
} from "lucide-react";
import { NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const navigationItems = [
  {
    title: "DASHBOARD",
    items: [
      { title: "Dashboard", url: "/", icon: Home },
    ]
  },
  {
    title: "SYSTEM MANAGEMENT",
    items: [
      { title: "Roles", url: "/roles", icon: Shield },
      { title: "Permissions", url: "/permissions", icon: Settings },
      { title: "Features", url: "/features", icon: Star },
      { title: "Settings", url: "/settings", icon: Cog },
    ]
  },
  {
    title: "USER MANAGEMENT",
    items: [
      { title: "Profile", url: "/profile", icon: User },
      { title: "Register", url: "/register", icon: UserPlus },
      { title: "Employees", url: "/employees", icon: Users },
    ]
  },
  {
    title: "ATTENDANCE & TIMESHEET",
    items: [
      { title: "Timesheet", url: "/timesheet", icon: Clock },
      { title: "Timesheet Report", url: "/timesheet-report", icon: FileText },
      { title: "Ranged Timesheet Report", url: "/ranged-timesheet", icon: Calendar },
    ]
  },
  {
    title: "LEAVE MANAGEMENT",
    items: [
      { title: "Review Leave", url: "/review-leave", icon: FileText },
      { title: "Employee Request", url: "/employee-request", icon: UserPlus },
      { title: "Leave Records", url: "/leave-records", icon: Calendar },
      { title: "Leave Type", url: "/leave-type", icon: Settings },
      { title: "Leave Archive", url: "/leave-archive", icon: Archive },
    ]
  },
  {
    title: "ORGANIZATION",
    items: [
      { title: "Company", url: "/company", icon: Building },
      { title: "Department", url: "/department", icon: Briefcase },
      { title: "Designation", url: "/designation", icon: User },
      { title: "Salary Structure", url: "/salary-structure", icon: DollarSign },
      { title: "Office Locations", url: "/office-locations", icon: MapPin },
    ]
  }
];

export function AppSidebar() {
  return (
    <Sidebar className="w-64 bg-white border-r border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-blue-600">ALGO-HRMS</h2>
      </div>
      
      <SidebarContent className="p-2">
        {navigationItems.map((group, index) => (
          <SidebarGroup key={index} className="mb-4">
            <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              {group.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        className={({ isActive }) =>
                          `flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            isActive
                              ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
                              : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                          }`
                        }
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
