
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Server, Users, Database, Activity } from 'lucide-react';

const statsData = [
  {
    title: "Instance Pools",
    value: "4",
    icon: Server,
    description: "Active pools",
  },
  {
    title: "Instances",
    value: "24",
    icon: Users,
    description: "Running instances",
  },
  {
    title: "Autoscale Events",
    value: "142",
    icon: Activity,
    description: "Last 30 days",
  },
  {
    title: "Storage Usage",
    value: "68%",
    icon: Database,
    description: "Across all instances",
  },
];

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statsData.map((stat, index) => (
          <Card key={index} className="glass-card glass-card-hover">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-teal-400">
                {stat.value}
              </div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Instance Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center text-muted-foreground">
              Chart placeholder
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Recent Scaling Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center text-muted-foreground">
              Chart placeholder
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
