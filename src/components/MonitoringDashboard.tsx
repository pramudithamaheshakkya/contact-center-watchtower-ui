import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Activity, 
  Cpu, 
  HardDrive, 
  MemoryStick, 
  Network, 
  Server, 
  Container, 
  Play, 
  Square, 
  RotateCcw,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  Download
} from "lucide-react";
import { SystemOverview } from "./monitoring/SystemOverview";
import { ContainerGrid } from "./monitoring/ContainerGrid";
import { LogViewer } from "./monitoring/LogViewer";
import { AlertPanel } from "./monitoring/AlertPanel";

// Mock data for demonstration
const mockSystemData = {
  cpu: { usage: 67, cores: 8, temperature: 72 },
  memory: { used: 24.5, total: 32, usage: 76.5 },
  disk: { used: 1.2, total: 2.0, usage: 60 },
  network: { in: 125.3, out: 89.7 },
  uptime: "12d 15h 42m",
  load: [1.2, 1.5, 1.8]
};

const mockContainers = [
  {
    id: "web-frontend",
    name: "Web Frontend",
    status: "running" as const,
    cpu: 12,
    memory: 512,
    uptime: "2d 5h",
    restarts: 0,
    image: "nginx:latest"
  },
  {
    id: "api-service",
    name: "API Service",
    status: "running" as const,
    cpu: 45,
    memory: 1024,
    uptime: "2d 5h",
    restarts: 1,
    image: "node:18"
  },
  {
    id: "cube-analytics",
    name: "Cube Analytics",
    status: "running" as const,
    cpu: 23,
    memory: 768,
    uptime: "2d 4h",
    restarts: 0,
    image: "cubejs/cube:latest"
  },
  {
    id: "redis",
    name: "Redis",
    status: "running" as const,
    cpu: 8,
    memory: 256,
    uptime: "2d 5h",
    restarts: 0,
    image: "redis:7-alpine"
  },
  {
    id: "postgres",
    name: "PostgreSQL",
    status: "running" as const,
    cpu: 15,
    memory: 512,
    uptime: "2d 5h",
    restarts: 0,
    image: "postgres:15"
  },
  {
    id: "nats",
    name: "NATS",
    status: "stopped" as const,
    cpu: 0,
    memory: 0,
    uptime: "0m",
    restarts: 3,
    image: "nats:latest"
  }
];

export function MonitoringDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [systemData, setSystemData] = useState(mockSystemData);
  const [containers, setContainers] = useState(mockContainers);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemData(prev => ({
        ...prev,
        cpu: { ...prev.cpu, usage: Math.max(10, Math.min(90, prev.cpu.usage + (Math.random() - 0.5) * 10)) },
        memory: { ...prev.memory, usage: Math.max(10, Math.min(90, prev.memory.usage + (Math.random() - 0.5) * 5)) },
        network: {
          in: Math.max(0, prev.network.in + (Math.random() - 0.5) * 50),
          out: Math.max(0, prev.network.out + (Math.random() - 0.5) * 30)
        }
      }));
      
      setContainers(prev => prev.map(container => ({
        ...container,
        cpu: container.status === "running" 
          ? Math.max(0, Math.min(100, container.cpu + (Math.random() - 0.5) * 20))
          : 0
      })));
      
      setLastUpdate(new Date());
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const runningContainers = containers.filter(c => c.status === "running").length;
  const totalContainers = containers.length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur">
        <div className="flex items-center justify-between p-6">
          <div>
            <h1 className="text-3xl font-bold gradient-text">System Monitor</h1>
            <p className="text-muted-foreground mt-1">
              Contact Center & CRM Infrastructure
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="gap-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              Live
            </Badge>
            <div className="text-sm text-muted-foreground">
              Last update: {lastUpdate.toLocaleTimeString()}
            </div>
            <Button variant="outline" size="sm">
              <RotateCcw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </header>

      {/* Quick Stats Bar */}
      <div className="border-b border-border bg-card/30">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <Server className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">Server Online</span>
              <CheckCircle className="w-4 h-4 status-running" />
            </div>
            <div className="flex items-center gap-2">
              <Container className="w-5 h-5 text-primary" />
              <span className="text-sm">
                {runningContainers}/{totalContainers} Containers Running
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 cpu-color" />
              <span className="text-sm">CPU: {systemData.cpu.usage.toFixed(1)}%</span>
            </div>
            <div className="flex items-center gap-2">
              <MemoryStick className="w-5 h-5 memory-color" />
              <span className="text-sm">RAM: {systemData.memory.usage.toFixed(1)}%</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Uptime: {systemData.uptime}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
            <TabsTrigger value="overview">System Overview</TabsTrigger>
            <TabsTrigger value="containers">Containers</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <SystemOverview systemData={systemData} />
          </TabsContent>

          <TabsContent value="containers" className="space-y-6">
            <ContainerGrid containers={containers} setContainers={setContainers} />
          </TabsContent>

          <TabsContent value="logs" className="space-y-6">
            <LogViewer containers={containers} />
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <AlertPanel systemData={systemData} containers={containers} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}