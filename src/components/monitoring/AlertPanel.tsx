import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  CheckCircle, 
  Bell,
  BellOff,
  X,
  Clock,
  TrendingUp,
  Cpu,
  MemoryStick,
  HardDrive
} from "lucide-react";

interface SystemData {
  cpu: { usage: number; cores: number; temperature: number };
  memory: { used: number; total: number; usage: number };
  disk: { used: number; total: number; usage: number };
  network: { in: number; out: number };
  uptime: string;
  load: number[];
}

interface ContainerData {
  id: string;
  name: string;
  status: "running" | "stopped" | "error";
  cpu: number;
  memory: number;
  uptime: string;
  restarts: number;
}

interface AlertData {
  id: string;
  type: "critical" | "warning" | "info";
  title: string;
  description: string;
  timestamp: string;
  source: string;
  acknowledged: boolean;
}

interface AlertPanelProps {
  systemData: SystemData;
  containers: ContainerData[];
}

export function AlertPanel({ systemData, containers }: AlertPanelProps) {
  const [alerts, setAlerts] = useState<AlertData[]>([
    {
      id: "1",
      type: "warning",
      title: "High CPU Usage",
      description: "System CPU usage has exceeded 65% for the last 5 minutes",
      timestamp: "2024-01-15 10:25:00",
      source: "System Monitor",
      acknowledged: false
    },
    {
      id: "2",
      type: "critical",
      title: "Container Restart Loop",
      description: "NATS container has restarted 3 times in the last hour",
      timestamp: "2024-01-15 10:20:00",
      source: "Container Monitor",
      acknowledged: false
    },
    {
      id: "3",
      type: "info",
      title: "Scheduled Maintenance",
      description: "System maintenance window scheduled for tonight at 2:00 AM",
      timestamp: "2024-01-15 09:00:00",
      source: "Maintenance Scheduler",
      acknowledged: true
    },
    {
      id: "4",
      type: "warning",
      title: "Memory Usage Alert",
      description: "System memory usage approaching 80% threshold",
      timestamp: "2024-01-15 08:45:00",
      source: "System Monitor",
      acknowledged: false
    }
  ]);

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const acknowledgeAlert = (id: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, acknowledged: true } : alert
    ));
  };

  const dismissAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "critical":
        return <AlertCircle className="h-5 w-5 text-red-400" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-400" />;
      case "info":
        return <Info className="h-5 w-5 text-blue-400" />;
      default:
        return <Info className="h-5 w-5 text-gray-400" />;
    }
  };

  const getAlertBadge = (type: string) => {
    const variants = {
      critical: "bg-red-500/20 text-red-400 border-red-500/50",
      warning: "bg-yellow-500/20 text-yellow-400 border-yellow-500/50",
      info: "bg-blue-500/20 text-blue-400 border-blue-500/50"
    };
    
    return (
      <Badge 
        variant="outline" 
        className={`${variants[type as keyof typeof variants]} text-xs`}
      >
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Badge>
    );
  };

  // Generate dynamic alerts based on current system state
  const generateSystemAlerts = () => {
    const dynamicAlerts: AlertData[] = [];
    
    if (systemData.cpu.usage > 80) {
      dynamicAlerts.push({
        id: `cpu-${Date.now()}`,
        type: "critical",
        title: "Critical CPU Usage",
        description: `CPU usage at ${systemData.cpu.usage.toFixed(1)}% - immediate attention required`,
        timestamp: new Date().toLocaleString(),
        source: "System Monitor",
        acknowledged: false
      });
    } else if (systemData.cpu.usage > 65) {
      dynamicAlerts.push({
        id: `cpu-${Date.now()}`,
        type: "warning",
        title: "High CPU Usage",
        description: `CPU usage at ${systemData.cpu.usage.toFixed(1)}% - monitor closely`,
        timestamp: new Date().toLocaleString(),
        source: "System Monitor",
        acknowledged: false
      });
    }

    if (systemData.memory.usage > 85) {
      dynamicAlerts.push({
        id: `memory-${Date.now()}`,
        type: "critical",
        title: "Critical Memory Usage",
        description: `Memory usage at ${systemData.memory.usage.toFixed(1)}% - risk of system instability`,
        timestamp: new Date().toLocaleString(),
        source: "System Monitor",
        acknowledged: false
      });
    }

    const stoppedContainers = containers.filter(c => c.status === "stopped");
    if (stoppedContainers.length > 0) {
      dynamicAlerts.push({
        id: `containers-${Date.now()}`,
        type: "warning",
        title: "Stopped Containers",
        description: `${stoppedContainers.length} container(s) are currently stopped`,
        timestamp: new Date().toLocaleString(),
        source: "Container Monitor",
        acknowledged: false
      });
    }

    return dynamicAlerts;
  };

  const allAlerts = [...alerts, ...generateSystemAlerts()];
  const unacknowledgedAlerts = allAlerts.filter(alert => !alert.acknowledged);
  const criticalAlerts = allAlerts.filter(alert => alert.type === "critical");

  return (
    <div className="space-y-6">
      {/* Alert Summary */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="metric-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Alerts</p>
                <p className="text-2xl font-bold">{allAlerts.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="metric-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Critical</p>
                <p className="text-2xl font-bold text-red-400">
                  {criticalAlerts.length}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="metric-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Unacknowledged</p>
                <p className="text-2xl font-bold text-yellow-400">
                  {unacknowledgedAlerts.length}
                </p>
              </div>
              <Bell className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="metric-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Notifications</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                  className="p-0 h-auto font-bold text-base"
                >
                  {notificationsEnabled ? "Enabled" : "Disabled"}
                </Button>
              </div>
              {notificationsEnabled ? (
                <Bell className="h-8 w-8 text-primary" />
              ) : (
                <BellOff className="h-8 w-8 text-muted-foreground" />
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Health Overview */}
      <Card className="metric-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            System Health Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Alert className={systemData.cpu.usage > 80 ? "border-red-500/50 bg-red-500/10" : 
                             systemData.cpu.usage > 65 ? "border-yellow-500/50 bg-yellow-500/10" : 
                             "border-green-500/50 bg-green-500/10"}>
              <Cpu className="h-4 w-4" />
              <AlertDescription>
                <div className="flex items-center justify-between">
                  <span>CPU Usage</span>
                  <span className="font-semibold">{systemData.cpu.usage.toFixed(1)}%</span>
                </div>
              </AlertDescription>
            </Alert>
            
            <Alert className={systemData.memory.usage > 85 ? "border-red-500/50 bg-red-500/10" : 
                             systemData.memory.usage > 70 ? "border-yellow-500/50 bg-yellow-500/10" : 
                             "border-green-500/50 bg-green-500/10"}>
              <MemoryStick className="h-4 w-4" />
              <AlertDescription>
                <div className="flex items-center justify-between">
                  <span>Memory Usage</span>
                  <span className="font-semibold">{systemData.memory.usage.toFixed(1)}%</span>
                </div>
              </AlertDescription>
            </Alert>
            
            <Alert className={systemData.disk.usage > 90 ? "border-red-500/50 bg-red-500/10" : 
                             systemData.disk.usage > 75 ? "border-yellow-500/50 bg-yellow-500/10" : 
                             "border-green-500/50 bg-green-500/10"}>
              <HardDrive className="h-4 w-4" />
              <AlertDescription>
                <div className="flex items-center justify-between">
                  <span>Disk Usage</span>
                  <span className="font-semibold">{systemData.disk.usage.toFixed(1)}%</span>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      {/* Alert List */}
      <Card className="metric-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-primary" />
            Active Alerts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {allAlerts.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 mx-auto text-green-400 mb-4" />
              <h3 className="text-lg font-semibold text-green-400">All Clear!</h3>
              <p className="text-muted-foreground">No active alerts at this time.</p>
            </div>
          ) : (
            allAlerts.map((alert) => (
              <div 
                key={alert.id}
                className={`p-4 rounded-lg border transition-all ${
                  alert.acknowledged 
                    ? "border-border bg-muted/20 opacity-60" 
                    : alert.type === "critical"
                    ? "border-red-500/50 bg-red-500/10 glow"
                    : alert.type === "warning"
                    ? "border-yellow-500/50 bg-yellow-500/10"
                    : "border-blue-500/50 bg-blue-500/10"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{alert.title}</h4>
                        {getAlertBadge(alert.type)}
                        {alert.acknowledged && (
                          <Badge variant="outline" className="text-xs">
                            Acknowledged
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {alert.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {alert.timestamp}
                        </span>
                        <span>Source: {alert.source}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    {!alert.acknowledged && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => acknowledgeAlert(alert.id)}
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Ack
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => dismissAlert(alert.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}