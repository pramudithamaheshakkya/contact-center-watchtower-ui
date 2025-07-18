import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Container, 
  Play, 
  Square, 
  RotateCcw,
  Eye,
  Download,
  Trash2,
  Settings,
  AlertCircle,
  CheckCircle,
  Clock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ContainerData {
  id: string;
  name: string;
  status: "running" | "stopped" | "error";
  cpu: number;
  memory: number;
  uptime: string;
  restarts: number;
  image: string;
}

interface ContainerGridProps {
  containers: ContainerData[];
  setContainers: React.Dispatch<React.SetStateAction<ContainerData[]>>;
}

export function ContainerGrid({ containers, setContainers }: ContainerGridProps) {
  const { toast } = useToast();
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const handleContainerAction = async (id: string, action: string) => {
    setActionLoading(id);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setContainers(prev => prev.map(container => {
      if (container.id === id) {
        switch (action) {
          case "start":
            toast({
              title: "Container Started",
              description: `${container.name} is now running`,
            });
            return { ...container, status: "running" as const, uptime: "0m" };
          case "stop":
            toast({
              title: "Container Stopped",
              description: `${container.name} has been stopped`,
            });
            return { ...container, status: "stopped" as const, cpu: 0, memory: 0, uptime: "0m" };
          case "restart":
            toast({
              title: "Container Restarted",
              description: `${container.name} has been restarted`,
            });
            return { ...container, status: "running" as const, restarts: container.restarts + 1, uptime: "0m" };
          default:
            return container;
        }
      }
      return container;
    }));
    
    setActionLoading(null);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "running":
        return <CheckCircle className="h-4 w-4 status-running" />;
      case "stopped":
        return <Square className="h-4 w-4 status-stopped" />;
      case "error":
        return <AlertCircle className="h-4 w-4 status-error" />;
      default:
        return <AlertCircle className="h-4 w-4 status-stopped" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      running: "bg-green-500/20 text-green-400 border-green-500/50",
      stopped: "bg-gray-500/20 text-gray-400 border-gray-500/50",
      error: "bg-red-500/20 text-red-400 border-red-500/50"
    };
    
    return (
      <Badge 
        variant="outline" 
        className={`${variants[status as keyof typeof variants]} gap-1`}
      >
        {getStatusIcon(status)}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const formatMemory = (memory: number) => {
    return `${memory} MB`;
  };

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="metric-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Containers</p>
                <p className="text-2xl font-bold">{containers.length}</p>
              </div>
              <Container className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="metric-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Running</p>
                <p className="text-2xl font-bold status-running">
                  {containers.filter(c => c.status === "running").length}
                </p>
              </div>
              <Play className="h-8 w-8 status-running" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="metric-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Stopped</p>
                <p className="text-2xl font-bold status-stopped">
                  {containers.filter(c => c.status === "stopped").length}
                </p>
              </div>
              <Square className="h-8 w-8 status-stopped" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="metric-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Restarts</p>
                <p className="text-2xl font-bold">
                  {containers.reduce((sum, c) => sum + c.restarts, 0)}
                </p>
              </div>
              <RotateCcw className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Container Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {containers.map((container) => (
          <Card key={container.id} className="metric-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{container.name}</CardTitle>
                {getStatusBadge(container.status)}
              </div>
              <p className="text-xs text-muted-foreground font-mono">
                {container.image}
              </p>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Resource Usage */}
              {container.status === "running" && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">CPU Usage</span>
                      <span className="font-mono cpu-color">
                        {container.cpu.toFixed(1)}%
                      </span>
                    </div>
                    <Progress 
                      value={container.cpu} 
                      className="h-1.5"
                      style={{ background: `hsl(var(--cpu-color) / 0.2)` }}
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Memory</span>
                      <span className="font-mono memory-color">
                        {formatMemory(container.memory)}
                      </span>
                    </div>
                    <Progress 
                      value={(container.memory / 2048) * 100} 
                      className="h-1.5"
                      style={{ background: `hsl(var(--memory-color) / 0.2)` }}
                    />
                  </div>
                </div>
              )}
              
              {/* Container Info */}
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">Uptime</div>
                  <div className="text-sm font-semibold flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {container.uptime}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">Restarts</div>
                  <div className="text-sm font-semibold flex items-center gap-1">
                    <RotateCcw className="h-3 w-3" />
                    {container.restarts}
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                {container.status === "running" ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleContainerAction(container.id, "stop")}
                      disabled={actionLoading === container.id}
                      className="flex-1"
                    >
                      <Square className="h-3 w-3 mr-1" />
                      Stop
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleContainerAction(container.id, "restart")}
                      disabled={actionLoading === container.id}
                      className="flex-1"
                    >
                      <RotateCcw className="h-3 w-3 mr-1" />
                      Restart
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleContainerAction(container.id, "start")}
                    disabled={actionLoading === container.id}
                    className="flex-1"
                  >
                    <Play className="h-3 w-3 mr-1" />
                    Start
                  </Button>
                )}
                
                <Button variant="outline" size="sm">
                  <Eye className="h-3 w-3" />
                </Button>
                
                <Button variant="outline" size="sm">
                  <Download className="h-3 w-3" />
                </Button>
              </div>
              
              {actionLoading === container.id && (
                <div className="text-xs text-muted-foreground text-center">
                  Processing action...
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}