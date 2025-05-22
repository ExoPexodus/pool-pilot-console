
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ChartData {
  name: string;
  value: number;
}

interface LineChartCardProps {
  title: string;
  data: ChartData[];
  className?: string;
}

const LineChartCard = ({ title, data, className }: LineChartCardProps) => {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 20, bottom: 25, left: 0 }}
            >
              <defs>
                <linearGradient id="colorLine" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2DD4BF" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#2DD4BF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="#333" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 10, fill: "#888" }}
                axisLine={{ stroke: "#444" }}
                tickLine={{ stroke: "#444" }}
              />
              <YAxis 
                tick={{ fontSize: 10, fill: "#888" }}
                axisLine={{ stroke: "#444" }}
                tickLine={{ stroke: "#444" }}
              />
              <Tooltip
                contentStyle={{ backgroundColor: "#222", border: "1px solid #333" }}
                labelStyle={{ color: "#fff" }}
                itemStyle={{ color: "#2DD4BF" }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#2DD4BF"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6, fill: "#2DD4BF" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default LineChartCard;
