import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Cpu, 
  MemoryStick, 
  HardDrive, 
  Network, 
  Thermometer,
  Gauge,
  TrendingUp,
  Server
} from "lucide-react";

interface SystemData {
  cpu: { usage: number; cores: number; temperature: number };
  memory: { used: number; total: number; usage: number };
  disk: { used: number; total: number; usage: number };
  network: { in: number; out: number };
  uptime: string;
  load: number[];
}

interface SystemOverviewProps {
  systemData: SystemData;
}

export function SystemOverview({ systemData }: SystemOverviewProps) {
  const getUsageColor = (usage: number) => {
    if (usage >= 80) return "status-error";
    if (usage >= 60) return "status-warning";
    return "status-running";
  };

  const formatBytes = (bytes: number) => {
    return `${bytes.toFixed(1)} GB`;
  };

  const formatSpeed = (speed: number) => {
    return `${speed.toFixed(1)} MB/s`;
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {/* CPU Card */}
      <Card className="metric-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
          <Cpu className="h-5 w-5 cpu-color" />
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold pulse-data">
              {systemData.cpu.usage.toFixed(1)}%
            </span>
            <Badge variant="outline" className={getUsageColor(systemData.cpu.usage)}>
              {systemData.cpu.cores} cores
            </Badge>
          </div>
          <Progress 
            value={systemData.cpu.usage} 
            className="h-2"
            style={{ background: `hsl(var(--cpu-color) / 0.2)` }}
          />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Thermometer className="h-3 w-3" />
              {systemData.cpu.temperature}°C
            </span>
            <span className="flex items-center gap-1">
              <Gauge className="h-3 w-3" />
              Load: {systemData.load[2].toFixed(1)}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Memory Card */}
      <Card className="metric-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
          <MemoryStick className="h-5 w-5 memory-color" />
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold pulse-data">
              {systemData.memory.usage.toFixed(1)}%
            </span>
            <Badge variant="outline" className={getUsageColor(systemData.memory.usage)}>
              {formatBytes(systemData.memory.total)} total
            </Badge>
          </div>
          <Progress 
            value={systemData.memory.usage} 
            className="h-2"
            style={{ background: `hsl(var(--memory-color) / 0.2)` }}
          />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Used: {formatBytes(systemData.memory.used)}</span>
            <span>Free: {formatBytes(systemData.memory.total - systemData.memory.used)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Disk Card */}
      <Card className="metric-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Disk Usage</CardTitle>
          <HardDrive className="h-5 w-5 disk-color" />
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold">
              {systemData.disk.usage.toFixed(1)}%
            </span>
            <Badge variant="outline" className={getUsageColor(systemData.disk.usage)}>
              {formatBytes(systemData.disk.total)} total
            </Badge>
          </div>
          <Progress 
            value={systemData.disk.usage} 
            className="h-2"
            style={{ background: `hsl(var(--disk-color) / 0.2)` }}
          />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Used: {formatBytes(systemData.disk.used)} TB</span>
            <span>Free: {formatBytes(systemData.disk.total - systemData.disk.used)} TB</span>
          </div>
        </CardContent>
      </Card>

      {/* Network Card */}
      <Card className="metric-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Network I/O</CardTitle>
          <Network className="h-5 w-5 network-color" />
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Incoming</span>
              <span className="text-lg font-semibold pulse-data network-color">
                {formatSpeed(systemData.network.in)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Outgoing</span>
              <span className="text-lg font-semibold pulse-data network-color">
                {formatSpeed(systemData.network.out)}
              </span>
            </div>
          </div>
          <div className="pt-2 border-t border-border">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                Peak: {formatSpeed(Math.max(systemData.network.in, systemData.network.out) * 1.5)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Info Card - spans 2 columns */}
      <Card className="metric-card md:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">System Information</CardTitle>
          <Server className="h-5 w-5 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Uptime</div>
              <div className="text-lg font-semibold">{systemData.uptime}</div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Load Average</div>
              <div className="text-lg font-semibold">
                {systemData.load.map(l => l.toFixed(1)).join(", ")}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">OS</div>
              <div className="text-lg font-semibold">Linux Ubuntu 22.04</div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Docker</div>
              <div className="text-lg font-semibold">24.0.7</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resource History Chart Placeholder */}
      <Card className="metric-card md:col-span-2">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Resource Usage History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-32 flex items-center justify-center text-muted-foreground">
            <div className="text-center space-y-2">
              <TrendingUp className="h-8 w-8 mx-auto opacity-50" />
              <p className="text-sm">Real-time charts would be integrated here</p>
              <p className="text-xs">Using Chart.js, D3.js, or Recharts</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}