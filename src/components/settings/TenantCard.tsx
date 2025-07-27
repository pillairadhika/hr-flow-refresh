
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Edit, Trash2, Settings, Eye, EyeOff } from "lucide-react";

interface Tenant {
  id: string;
  name: string;
  domain: string;
  connectionString: string;
  isActive: boolean;
  createdAt: string;
  adminEmail: string;
  config?: any;
}

interface TenantCardProps {
  tenant: Tenant;
  showConnectionStrings: {[key: string]: boolean};
  onEdit: (tenant: Tenant) => void;
  onDelete: (tenantId: string) => void;
  onConfigure: (tenant: Tenant) => void;
  onToggleStatus: (tenantId: string) => void;
  onToggleConnectionString: (tenantId: string) => void;
}

export const TenantCard = ({ 
  tenant, 
  showConnectionStrings, 
  onEdit, 
  onDelete, 
  onConfigure, 
  onToggleStatus, 
  onToggleConnectionString 
}: TenantCardProps) => {
  return (
    <div className="border rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-lg">{tenant.name}</h3>
          <p className="text-sm text-gray-600">{tenant.domain}</p>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            checked={tenant.isActive}
            onCheckedChange={() => onToggleStatus(tenant.id)}
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
            onClick={() => onToggleConnectionString(tenant.id)}
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
        <Button variant="outline" size="sm" onClick={() => onEdit(tenant)}>
          <Edit className="h-4 w-4 mr-1" />
          Edit
        </Button>
        <Button variant="outline" size="sm" onClick={() => onConfigure(tenant)}>
          <Settings className="h-4 w-4 mr-1" />
          Configure
        </Button>
        <Button variant="outline" size="sm" onClick={() => onDelete(tenant.id)}>
          <Trash2 className="h-4 w-4 mr-1" />
          Delete
        </Button>
      </div>
    </div>
  );
};
