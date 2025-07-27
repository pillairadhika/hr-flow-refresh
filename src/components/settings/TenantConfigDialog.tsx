
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Database, Mail, Shield } from "lucide-react";

interface TenantConfig {
  // Database Settings
  maxConnections: number;
  connectionTimeout: number;
  queryTimeout: number;
  enableReadReplica: boolean;
  
  // Email Settings
  smtpHost: string;
  smtpPort: number;
  smtpUsername: string;
  smtpPassword: string;
  fromEmail: string;
  enableEmailNotifications: boolean;
  
  // Security Settings
  enableTwoFactor: boolean;
  sessionTimeout: number;
  maxLoginAttempts: number;
  enableAuditLogging: boolean;
  
  // General Settings
  timezone: string;
  dateFormat: string;
  currency: string;
  language: string;
  enableMobileApp: boolean;
  enableApiAccess: boolean;
}

interface Tenant {
  id: string;
  name: string;
  domain: string;
  connectionString: string;
  isActive: boolean;
  createdAt: string;
  adminEmail: string;
  config?: TenantConfig;
}

interface TenantConfigDialogProps {
  tenant: Tenant | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (tenantId: string, config: TenantConfig) => void;
}

export const TenantConfigDialog = ({ tenant, isOpen, onClose, onSave }: TenantConfigDialogProps) => {
  const [config, setConfig] = useState<TenantConfig>(() => ({
    // Database Settings
    maxConnections: tenant?.config?.maxConnections || 100,
    connectionTimeout: tenant?.config?.connectionTimeout || 30,
    queryTimeout: tenant?.config?.queryTimeout || 60,
    enableReadReplica: tenant?.config?.enableReadReplica || false,
    
    // Email Settings
    smtpHost: tenant?.config?.smtpHost || "",
    smtpPort: tenant?.config?.smtpPort || 587,
    smtpUsername: tenant?.config?.smtpUsername || "",
    smtpPassword: tenant?.config?.smtpPassword || "",
    fromEmail: tenant?.config?.fromEmail || "",
    enableEmailNotifications: tenant?.config?.enableEmailNotifications || true,
    
    // Security Settings
    enableTwoFactor: tenant?.config?.enableTwoFactor || false,
    sessionTimeout: tenant?.config?.sessionTimeout || 480,
    maxLoginAttempts: tenant?.config?.maxLoginAttempts || 5,
    enableAuditLogging: tenant?.config?.enableAuditLogging || true,
    
    // General Settings
    timezone: tenant?.config?.timezone || "UTC",
    dateFormat: tenant?.config?.dateFormat || "MM/DD/YYYY",
    currency: tenant?.config?.currency || "USD",
    language: tenant?.config?.language || "en",
    enableMobileApp: tenant?.config?.enableMobileApp || true,
    enableApiAccess: tenant?.config?.enableApiAccess || false,
  }));

  const handleSave = () => {
    if (tenant) {
      onSave(tenant.id, config);
      onClose();
    }
  };

  if (!tenant) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Configure {tenant.name}</DialogTitle>
          <DialogDescription>
            Manage settings and configurations for this tenant
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="database" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="database" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Database
            </TabsTrigger>
            <TabsTrigger value="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="general" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              General
            </TabsTrigger>
          </TabsList>

          <TabsContent value="database">
            <Card>
              <CardHeader>
                <CardTitle>Database Configuration</CardTitle>
                <CardDescription>Configure database connection and performance settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="maxConnections">Max Connections</Label>
                    <Input
                      id="maxConnections"
                      type="number"
                      value={config.maxConnections}
                      onChange={(e) => setConfig({...config, maxConnections: parseInt(e.target.value)})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="connectionTimeout">Connection Timeout (seconds)</Label>
                    <Input
                      id="connectionTimeout"
                      type="number"
                      value={config.connectionTimeout}
                      onChange={(e) => setConfig({...config, connectionTimeout: parseInt(e.target.value)})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="queryTimeout">Query Timeout (seconds)</Label>
                    <Input
                      id="queryTimeout"
                      type="number"
                      value={config.queryTimeout}
                      onChange={(e) => setConfig({...config, queryTimeout: parseInt(e.target.value)})}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="enableReadReplica"
                      checked={config.enableReadReplica}
                      onCheckedChange={(checked) => setConfig({...config, enableReadReplica: checked})}
                    />
                    <Label htmlFor="enableReadReplica">Enable Read Replica</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="email">
            <Card>
              <CardHeader>
                <CardTitle>Email Configuration</CardTitle>
                <CardDescription>Configure SMTP settings and email notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="smtpHost">SMTP Host</Label>
                    <Input
                      id="smtpHost"
                      value={config.smtpHost}
                      onChange={(e) => setConfig({...config, smtpHost: e.target.value})}
                      placeholder="smtp.gmail.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="smtpPort">SMTP Port</Label>
                    <Input
                      id="smtpPort"
                      type="number"
                      value={config.smtpPort}
                      onChange={(e) => setConfig({...config, smtpPort: parseInt(e.target.value)})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="smtpUsername">SMTP Username</Label>
                    <Input
                      id="smtpUsername"
                      value={config.smtpUsername}
                      onChange={(e) => setConfig({...config, smtpUsername: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="smtpPassword">SMTP Password</Label>
                    <Input
                      id="smtpPassword"
                      type="password"
                      value={config.smtpPassword}
                      onChange={(e) => setConfig({...config, smtpPassword: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="fromEmail">From Email</Label>
                    <Input
                      id="fromEmail"
                      type="email"
                      value={config.fromEmail}
                      onChange={(e) => setConfig({...config, fromEmail: e.target.value})}
                      placeholder="noreply@company.com"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="enableEmailNotifications"
                      checked={config.enableEmailNotifications}
                      onCheckedChange={(checked) => setConfig({...config, enableEmailNotifications: checked})}
                    />
                    <Label htmlFor="enableEmailNotifications">Enable Email Notifications</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Configuration</CardTitle>
                <CardDescription>Configure security and authentication settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="enableTwoFactor"
                      checked={config.enableTwoFactor}
                      onCheckedChange={(checked) => setConfig({...config, enableTwoFactor: checked})}
                    />
                    <Label htmlFor="enableTwoFactor">Enable Two-Factor Authentication</Label>
                  </div>
                  <div>
                    <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                    <Input
                      id="sessionTimeout"
                      type="number"
                      value={config.sessionTimeout}
                      onChange={(e) => setConfig({...config, sessionTimeout: parseInt(e.target.value)})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                    <Input
                      id="maxLoginAttempts"
                      type="number"
                      value={config.maxLoginAttempts}
                      onChange={(e) => setConfig({...config, maxLoginAttempts: parseInt(e.target.value)})}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="enableAuditLogging"
                      checked={config.enableAuditLogging}
                      onCheckedChange={(checked) => setConfig({...config, enableAuditLogging: checked})}
                    />
                    <Label htmlFor="enableAuditLogging">Enable Audit Logging</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>General Configuration</CardTitle>
                <CardDescription>Configure general application settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="timezone">Timezone</Label>
                    <Input
                      id="timezone"
                      value={config.timezone}
                      onChange={(e) => setConfig({...config, timezone: e.target.value})}
                      placeholder="UTC"
                    />
                  </div>
                  <div>
                    <Label htmlFor="dateFormat">Date Format</Label>
                    <Input
                      id="dateFormat"
                      value={config.dateFormat}
                      onChange={(e) => setConfig({...config, dateFormat: e.target.value})}
                      placeholder="MM/DD/YYYY"
                    />
                  </div>
                  <div>
                    <Label htmlFor="currency">Currency</Label>
                    <Input
                      id="currency"
                      value={config.currency}
                      onChange={(e) => setConfig({...config, currency: e.target.value})}
                      placeholder="USD"
                    />
                  </div>
                  <div>
                    <Label htmlFor="language">Language</Label>
                    <Input
                      id="language"
                      value={config.language}
                      onChange={(e) => setConfig({...config, language: e.target.value})}
                      placeholder="en"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="enableMobileApp"
                      checked={config.enableMobileApp}
                      onCheckedChange={(checked) => setConfig({...config, enableMobileApp: checked})}
                    />
                    <Label htmlFor="enableMobileApp">Enable Mobile App</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="enableApiAccess"
                      checked={config.enableApiAccess}
                      onCheckedChange={(checked) => setConfig({...config, enableApiAccess: checked})}
                    />
                    <Label htmlFor="enableApiAccess">Enable API Access</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex gap-2 pt-4">
          <Button onClick={handleSave} className="flex-1">
            Save Configuration
          </Button>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
