
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, Mail, Shield, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const SystemConfiguration = () => {
  const [config, setConfig] = useState({
    // Email Configuration
    smtpHost: "smtp.gmail.com",
    smtpPort: 587,
    smtpUser: "noreply@hrms.com",
    smtpPassword: "************",
    emailFrom: "HRMS System <noreply@hrms.com>",
    
    // Security Settings
    sessionTimeout: 30,
    passwordMinLength: 8,
    enableTwoFactor: true,
    maxLoginAttempts: 5,
    lockoutDuration: 15,
    
    // System Settings
    systemName: "ALGO-HRMS",
    systemUrl: "https://hrms.algorisys.com",
    timezone: "Asia/Kolkata",
    dateFormat: "DD/MM/YYYY",
    enableMaintenance: false,
    maintenanceMessage: "System is under maintenance. Please try again later.",
    
    // Feature Flags
    enableFileUpload: true,
    enableNotifications: true,
    enableAnalytics: true,
    enableApiAccess: true,
    maxFileSize: 10, // MB
    
    // Integration Settings
    enableSlackIntegration: false,
    slackWebhookUrl: "",
    enableTeamsIntegration: false,
    teamsWebhookUrl: "",
  });

  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "System Configuration Saved",
      description: "All system settings have been updated successfully.",
    });
  };

  const timezones = [
    "Asia/Kolkata",
    "America/New_York",
    "Europe/London",
    "Asia/Tokyo",
    "Australia/Sydney"
  ];

  const dateFormats = [
    "DD/MM/YYYY",
    "MM/DD/YYYY",
    "YYYY-MM-DD"
  ];

  return (
    <div className="space-y-6">
      {/* Email Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Configuration
          </CardTitle>
          <CardDescription>
            Configure SMTP settings for system emails
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="smtpHost">SMTP Host</Label>
              <Input
                id="smtpHost"
                value={config.smtpHost}
                onChange={(e) => setConfig({...config, smtpHost: e.target.value})}
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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="smtpUser">SMTP Username</Label>
              <Input
                id="smtpUser"
                value={config.smtpUser}
                onChange={(e) => setConfig({...config, smtpUser: e.target.value})}
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
          </div>

          <div>
            <Label htmlFor="emailFrom">Default From Email</Label>
            <Input
              id="emailFrom"
              value={config.emailFrom}
              onChange={(e) => setConfig({...config, emailFrom: e.target.value})}
            />
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Settings
          </CardTitle>
          <CardDescription>
            Configure security policies and authentication
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
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
              <Label htmlFor="passwordMinLength">Min Password Length</Label>
              <Input
                id="passwordMinLength"
                type="number"
                value={config.passwordMinLength}
                onChange={(e) => setConfig({...config, passwordMinLength: parseInt(e.target.value)})}
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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="lockoutDuration">Lockout Duration (minutes)</Label>
              <Input
                id="lockoutDuration"
                type="number"
                value={config.lockoutDuration}
                onChange={(e) => setConfig({...config, lockoutDuration: parseInt(e.target.value)})}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="enableTwoFactor">Enable Two-Factor Authentication</Label>
                <p className="text-sm text-gray-600">Require 2FA for all users</p>
              </div>
              <Switch
                id="enableTwoFactor"
                checked={config.enableTwoFactor}
                onCheckedChange={(checked) => setConfig({...config, enableTwoFactor: checked})}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            System Settings
          </CardTitle>
          <CardDescription>
            Configure general system preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="systemName">System Name</Label>
              <Input
                id="systemName"
                value={config.systemName}
                onChange={(e) => setConfig({...config, systemName: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="systemUrl">System URL</Label>
              <Input
                id="systemUrl"
                value={config.systemUrl}
                onChange={(e) => setConfig({...config, systemUrl: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="timezone">Default Timezone</Label>
              <Select value={config.timezone} onValueChange={(value) => setConfig({...config, timezone: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timezones.map(tz => (
                    <SelectItem key={tz} value={tz}>{tz}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="dateFormat">Date Format</Label>
              <Select value={config.dateFormat} onValueChange={(value) => setConfig({...config, dateFormat: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {dateFormats.map(format => (
                    <SelectItem key={format} value={format}>{format}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="enableMaintenance">Maintenance Mode</Label>
                <p className="text-sm text-gray-600">Enable maintenance mode for all tenants</p>
              </div>
              <Switch
                id="enableMaintenance"
                checked={config.enableMaintenance}
                onCheckedChange={(checked) => setConfig({...config, enableMaintenance: checked})}
              />
            </div>

            {config.enableMaintenance && (
              <div>
                <Label htmlFor="maintenanceMessage">Maintenance Message</Label>
                <Textarea
                  id="maintenanceMessage"
                  value={config.maintenanceMessage}
                  onChange={(e) => setConfig({...config, maintenanceMessage: e.target.value})}
                  placeholder="Enter maintenance message..."
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Feature Flags */}
      <Card>
        <CardHeader>
          <CardTitle>Feature Flags</CardTitle>
          <CardDescription>
            Enable or disable system features
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="enableFileUpload">File Upload</Label>
                <p className="text-sm text-gray-600">Allow file uploads</p>
              </div>
              <Switch
                id="enableFileUpload"
                checked={config.enableFileUpload}
                onCheckedChange={(checked) => setConfig({...config, enableFileUpload: checked})}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="enableNotifications">Notifications</Label>
                <p className="text-sm text-gray-600">Enable system notifications</p>
              </div>
              <Switch
                id="enableNotifications"
                checked={config.enableNotifications}
                onCheckedChange={(checked) => setConfig({...config, enableNotifications: checked})}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="enableAnalytics">Analytics</Label>
                <p className="text-sm text-gray-600">Enable usage analytics</p>
              </div>
              <Switch
                id="enableAnalytics"
                checked={config.enableAnalytics}
                onCheckedChange={(checked) => setConfig({...config, enableAnalytics: checked})}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="enableApiAccess">API Access</Label>
                <p className="text-sm text-gray-600">Enable API endpoints</p>
              </div>
              <Switch
                id="enableApiAccess"
                checked={config.enableApiAccess}
                onCheckedChange={(checked) => setConfig({...config, enableApiAccess: checked})}
              />
            </div>
          </div>

          {config.enableFileUpload && (
            <div>
              <Label htmlFor="maxFileSize">Max File Size (MB)</Label>
              <Input
                id="maxFileSize"
                type="number"
                value={config.maxFileSize}
                onChange={(e) => setConfig({...config, maxFileSize: parseInt(e.target.value)})}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} className="px-8">
          <Save className="h-4 w-4 mr-2" />
          Save All Settings
        </Button>
      </div>
    </div>
  );
};
