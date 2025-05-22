
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { cn } from "@/lib/utils";

export interface InstancePool {
  id: string;
  name: string;
  status: "active" | "inactive" | "warning";
  instanceCount: number;
  maxInstances: number;
  region: string;
  lastScaledAt: string;
}

interface InstancePoolCardProps {
  pool: InstancePool;
  className?: string;
}

const InstancePoolCard = ({ pool, className }: InstancePoolCardProps) => {
  const statusColors = {
    active: "bg-green-500/20 text-green-500 border-green-500/20",
    inactive: "bg-gray-500/20 text-gray-400 border-gray-500/20",
    warning: "bg-yellow-500/20 text-yellow-500 border-yellow-500/20",
  };

  const statusText = {
    active: "Active",
    inactive: "Inactive",
    warning: "Warning",
  };

  return (
    <Card className={cn("overflow-hidden glass-card glass-card-hover", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <div className="flex items-center space-x-2">
          <CardTitle className="text-base font-medium">{pool.name}</CardTitle>
          <Badge variant="outline" className={cn("text-xs", statusColors[pool.status])}>
            {statusText[pool.status]}
          </Badge>
        </div>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Settings className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Instances</p>
            <p className="text-sm font-medium">
              {pool.instanceCount} / {pool.maxInstances}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Region</p>
            <p className="text-sm font-medium">{pool.region}</p>
          </div>
          <div className="col-span-2">
            <p className="text-xs text-muted-foreground">Last scaled</p>
            <p className="text-sm font-medium">{pool.lastScaledAt}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InstancePoolCard;
