
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Tenant {
  id: string;
  name: string;
  domain: string;
  connectionString: string;
  isActive: boolean;
  createdAt: string;
  adminEmail: string;
}

export const TenantManagement = () => {
  const [tenants, setTenants] = useState<Tenant[]>([
    {
      id: "1",
      name: "Algorisys Technologies",
      domain: "algorisys.hrms.com",
      connectionString: "postgresql://user:password@localhost:5432/algorisys_db",
      isActive: true,
      createdAt: "2024-01-15",
      adminEmail: "admin@algorisys.com"
    },
    {
      id: "2",
      name: "Tech Solutions Inc",
      domain: "techsol.hrms.com",
      connectionString: "postgresql://user:password@localhost:5432/techsol_db",
      isActive: true,
      createdAt: "2024-02-10",
      adminEmail: "admin@techsol.com"
    }
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);
  const [showConnectionStrings, setShowConnectionStrings] = useState<{[key: string]: boolean}>({});
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    domain: "",
    connectionString: "",
    adminEmail: "",
    isActive: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingTenant) {
      setTenants(tenants.map(tenant => 
        tenant.id === editingTenant.id 
          ? { ...tenant, ...formData }
          : tenant
      ));
      toast({
        title: "Tenant Updated",
        description: `${formData.name} has been updated successfully.`,
      });
    } else {
      const newTenant: Tenant = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setTenants([...tenants, newTenant]);
      toast({
        title: "Tenant Added",
        description: `${formData.name} has been added successfully.`,
      });
    }

    setFormData({
      name: "",
      domain: "",
      connectionString: "",
      adminEmail: "",
      isActive: true
    });
    setIsAddDialogOpen(false);
    setEditingTenant(null);
  };

  const handleEdit = (tenant: Tenant) => {
    setEditingTenant(tenant);
    setFormData({
      name: tenant.name,
      domain: tenant.domain,
      connectionString: tenant.connectionString,
      adminEmail: tenant.adminEmail,
      isActive: tenant.isActive
    });
    setIsAddDialogOpen(true);
  };

  const handleDelete = (tenantId: string) => {
    setTenants(tenants.filter(tenant => tenant.id !== tenantId));
    toast({
      title: "Tenant Deleted",
      description: "Tenant has been removed successfully.",
      variant: "destructive"
    });
  };

  const toggleConnectionString = (tenantId: string) => {
    setShowConnectionStrings(prev => ({
      ...prev,
      [tenantId]: !prev[tenantId]
    }));
  };

  const toggleTenantStatus = (tenantId: string) => {
    setTenants(tenants.map(tenant => 
      tenant.id === tenantId 
        ? { ...tenant, isActive: !tenant.isActive }
        : tenant
    ));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Tenant Management</CardTitle>
              <CardDescription>
                Manage tenant organizations and their database connections
              </CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Tenant
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>
                    {editingTenant ? "Edit Tenant" : "Add New Tenant"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingTenant ? "Update tenant information" : "Create a new tenant organization"}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Organization Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Enter organization name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="domain">Domain</Label>
                    <Input
                      id="domain"
                      value={formData.domain}
                      onChange={(e) => setFormData({...formData, domain: e.target.value})}
                      placeholder="company.hrms.com"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="adminEmail">Admin Email</Label>
                    <Input
                      id="adminEmail"
                      type="email"
                      value={formData.adminEmail}
                      onChange={(e) => setFormData({...formData, adminEmail: e.target.value})}
                      placeholder="admin@company.com"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="connectionString">Database Connection String</Label>
                    <Textarea
                      id="connectionString"
                      value={formData.connectionString}
                      onChange={(e) => setFormData({...formData, connectionString: e.target.value})}
                      placeholder="postgresql://user:password@host:port/database"
                      required
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isActive"
                      checked={formData.isActive}
                      onCheckedChange={(checked) => setFormData({...formData, isActive: checked})}
                    />
                    <Label htmlFor="isActive">Active</Label>
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button type="submit" className="flex-1">
                      {editingTenant ? "Update" : "Create"} Tenant
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        setIsAddDialogOpen(false);
                        setEditingTenant(null);
                        setFormData({
                          name: "",
                          domain: "",
                          connectionString: "",
                          adminEmail: "",
                          isActive: true
                        });
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tenants.map((tenant) => (
              <div key={tenant.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{tenant.name}</h3>
                    <p className="text-sm text-gray-600">{tenant.domain}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={tenant.isActive}
                      onCheckedChange={() => toggleTenantStatus(tenant.id)}
                    />
                    <span className={`text-sm ${tenant.isActive ? 'text-green-600' : 'text-red-600'}`}>
                      {tenant.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Admin Email:</span>
                    <p className="text-gray-600">{tenant.adminEmail}</p>
                  </div>
                  <div>
                    <span className="font-medium">Created:</span>
                    <p className="text-gray-600">{tenant.createdAt}</p>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium text-sm">Database Connection:</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleConnectionString(tenant.id)}
                    >
                      {showConnectionStrings[tenant.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  <div className="bg-gray-50 p-2 rounded text-sm font-mono">
                    {showConnectionStrings[tenant.id] 
                      ? tenant.connectionString 
                      : tenant.connectionString.replace(/(:)([^:@]+)(@)/g, ':***@')
                    }
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(tenant)}>
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(tenant.id)}>
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
