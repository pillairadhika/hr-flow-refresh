
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Database, TestTube, Save, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const DatabaseSettings = () => {
  const [dbConfig, setDbConfig] = useState({
    masterConnectionString: "postgresql://admin:password@localhost:5432/hrms_master",
    maxConnections: 20,
    connectionTimeout: 30,
    enableConnectionPooling: true,
    enableSsl: true,
    backupEnabled: true,
    backupSchedule: "0 2 * * *", // Daily at 2 AM
    retentionDays: 30
  });

  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Database Settings Saved",
      description: "Database configuration has been updated successfully.",
    });
  };

  const testConnection = async () => {
    setIsTestingConnection(true);
    // Simulate connection test
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsTestingConnection(false);
    toast({
      title: "Connection Test",
      description: "Database connection is working properly.",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Master Database Configuration
          </CardTitle>
          <CardDescription>
            Configure the master database connection and settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="masterConnection">Master Connection String</Label>
            <Textarea
              id="masterConnection"
              value={dbConfig.masterConnectionString}
              onChange={(e) => setDbConfig({...dbConfig, masterConnectionString: e.target.value})}
              placeholder="postgresql://user:password@host:port/database"
              className="font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="maxConnections">Max Connections</Label>
              <Input
                id="maxConnections"
                type="number"
                value={dbConfig.maxConnections}
                onChange={(e) => setDbConfig({...dbConfig, maxConnections: parseInt(e.target.value)})}
              />
            </div>
            <div>
              <Label htmlFor="connectionTimeout">Connection Timeout (seconds)</Label>
              <Input
                id="connectionTimeout"
                type="number"
                value={dbConfig.connectionTimeout}
                onChange={(e) => setDbConfig({...dbConfig, connectionTimeout: parseInt(e.target.value)})}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="enablePooling">Enable Connection Pooling</Label>
                <p className="text-sm text-gray-600">Improves performance by reusing connections</p>
              </div>
              <Switch
                id="enablePooling"
                checked={dbConfig.enableConnectionPooling}
                onCheckedChange={(checked) => setDbConfig({...dbConfig, enableConnectionPooling: checked})}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="enableSsl">Enable SSL</Label>
                <p className="text-sm text-gray-600">Secure database connections</p>
              </div>
              <Switch
                id="enableSsl"
                checked={dbConfig.enableSsl}
                onCheckedChange={(checked) => setDbConfig({...dbConfig, enableSsl: checked})}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={testConnection} variant="outline" disabled={isTestingConnection}>
              {isTestingConnection ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <TestTube className="h-4 w-4 mr-2" />
              )}
              Test Connection
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Configuration
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Backup Settings</CardTitle>
          <CardDescription>
            Configure automated database backups
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="backupEnabled">Enable Automated Backups</Label>
              <p className="text-sm text-gray-600">Automatically backup all tenant databases</p>
            </div>
            <Switch
              id="backupEnabled"
              checked={dbConfig.backupEnabled}
              onCheckedChange={(checked) => setDbConfig({...dbConfig, backupEnabled: checked})}
            />
          </div>

          {dbConfig.backupEnabled && (
            <>
              <div>
                <Label htmlFor="backupSchedule">Backup Schedule (Cron Expression)</Label>
                <Input
                  id="backupSchedule"
                  value={dbConfig.backupSchedule}
                  onChange={(e) => setDbConfig({...dbConfig, backupSchedule: e.target.value})}
                  placeholder="0 2 * * *"
                  className="font-mono"
                />
                <p className="text-sm text-gray-600 mt-1">Current: Daily at 2:00 AM</p>
              </div>

              <div>
                <Label htmlFor="retentionDays">Retention Period (Days)</Label>
                <Input
                  id="retentionDays"
                  type="number"
                  value={dbConfig.retentionDays}
                  onChange={(e) => setDbConfig({...dbConfig, retentionDays: parseInt(e.target.value)})}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
