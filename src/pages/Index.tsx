
import { useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import StatsCard from "@/components/dashboard/StatsCard";
import InstancePoolCard, { InstancePool } from "@/components/dashboard/InstancePoolCard";
import LineChartCard from "@/components/dashboard/LineChart";
import { Server, RefreshCw, Database, Cloud } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Mock data for demonstration
const mockStats = [
  {
    title: "Total Instances",
    value: "128",
    icon: <Server className="h-4 w-4" />,
    description: "Across all pools",
    trend: { value: 12, isPositive: true },
  },
  {
    title: "Scaling Events",
    value: "24",
    icon: <RefreshCw className="h-4 w-4" />,
    description: "Last 24 hours",
    trend: { value: 8, isPositive: true },
  },
  {
    title: "Storage Used",
    value: "2.4 TB",
    icon: <Database className="h-4 w-4" />,
    description: "Out of 4 TB allocated",
    trend: { value: 5, isPositive: false },
  },
  {
    title: "Network Traffic",
    value: "8.2 GB/s",
    icon: <Cloud className="h-4 w-4" />,
    description: "Average over 1h",
    trend: { value: 2, isPositive: true },
  },
];

const mockInstancePools: InstancePool[] = [
  {
    id: "ip-1",
    name: "Web Services Pool",
    status: "active",
    instanceCount: 24,
    maxInstances: 32,
    region: "us-phoenix-1",
    lastScaledAt: "Today at 14:23",
  },
  {
    id: "ip-2",
    name: "Database Cluster",
    status: "active",
    instanceCount: 8,
    maxInstances: 12,
    region: "us-ashburn-1",
    lastScaledAt: "Today at 12:05",
  },
  {
    id: "ip-3",
    name: "Analytics Workers",
    status: "warning",
    instanceCount: 16,
    maxInstances: 16,
    region: "eu-frankfurt-1",
    lastScaledAt: "Yesterday at 23:17",
  },
  {
    id: "ip-4",
    name: "Dev Environment",
    status: "inactive",
    instanceCount: 0,
    maxInstances: 8,
    region: "ap-tokyo-1",
    lastScaledAt: "3 days ago",
  },
];

const chartData = [
  { name: "00:00", value: 24 },
  { name: "03:00", value: 22 },
  { name: "06:00", value: 18 },
  { name: "09:00", value: 32 },
  { name: "12:00", value: 48 },
  { name: "15:00", value: 56 },
  { name: "18:00", value: 42 },
  { name: "21:00", value: 30 },
];

const cpuUsageData = [
  { name: "00:00", value: 45 },
  { name: "03:00", value: 38 },
  { name: "06:00", value: 32 },
  { name: "09:00", value: 57 },
  { name: "12:00", value: 73 },
  { name: "15:00", value: 85 },
  { name: "18:00", value: 62 },
  { name: "21:00", value: 50 },
];

const Index = () => {
  useEffect(() => {
    document.title = "AutoScale Management";
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Welcome to your autoscaling management console.</p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
            {mockStats.map((stat) => (
              <StatsCard
                key={stat.title}
                title={stat.title}
                value={stat.value}
                description={stat.description}
                icon={stat.icon}
                trend={stat.trend}
              />
            ))}
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 mb-6">
            <LineChartCard 
              title="Instance Count (24h)" 
              data={chartData}
            />
            <LineChartCard 
              title="CPU Usage % (24h)" 
              data={cpuUsageData}
            />
          </div>
          
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Instance Pools</h2>
              <Button variant="outline" className="border-teal-500/50 text-teal-500 hover:bg-teal-500/10">
                Add New Pool
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {mockInstancePools.map((pool) => (
                <InstancePoolCard key={pool.id} pool={pool} />
              ))}
            </div>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Configuration Management</CardTitle>
                <CardDescription>
                  Connect and manage autoscaling settings for your instance pools
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center items-center py-8 px-4 border border-dashed border-muted-foreground/50 rounded-md animate-pulse-subtle">
                  <div className="text-center">
                    <p className="mb-2 text-teal-400 font-medium">No connections established</p>
                    <p className="text-sm text-muted-foreground max-w-md">
                      Connect your autoscaling containers to begin managing their configurations from this central dashboard.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
