
import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TenantManagement } from "@/components/settings/TenantManagement";
import { SystemConfiguration } from "@/components/settings/SystemConfiguration";
import { DatabaseSettings } from "@/components/settings/DatabaseSettings";
import { Shield, Database, Settings as SettingsIcon, Building } from "lucide-react";

const Settings = () => {
  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Super Admin Settings</h1>
          <p className="text-gray-600 mt-2">Manage system configuration, tenants, and database connections</p>
        </div>

        <Tabs defaultValue="tenants" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tenants" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              Tenant Management
            </TabsTrigger>
            <TabsTrigger value="database" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Database Settings
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center gap-2">
              <SettingsIcon className="h-4 w-4" />
              System Config
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tenants">
            <TenantManagement />
          </TabsContent>

          <TabsContent value="database">
            <DatabaseSettings />
          </TabsContent>

          <TabsContent value="system">
            <SystemConfiguration />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
