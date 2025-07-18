import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Download, 
  Trash2, 
  Filter,
  Eye,
  EyeOff,
  Terminal,
  AlertCircle,
  Info,
  AlertTriangle
} from "lucide-react";

interface ContainerData {
  id: string;
  name: string;
  status: "running" | "stopped" | "error";
}

interface LogEntry {
  id: string;
  container: string;
  timestamp: string;
  level: "error" | "warn" | "info" | "debug";
  message: string;
}

interface LogViewerProps {
  containers: ContainerData[];
}

export function LogViewer({ containers }: LogViewerProps) {
  const [selectedContainer, setSelectedContainer] = useState<string>("all");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLiveTail, setIsLiveTail] = useState(true);
  const logEndRef = useRef<HTMLDivElement>(null);

  // Mock log data
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: "1",
      container: "api-service",
      timestamp: "2024-01-15 10:30:15",
      level: "info",
      message: "Server started on port 3000"
    },
    {
      id: "2",
      container: "web-frontend",
      timestamp: "2024-01-15 10:30:16",
      level: "info", 
      message: "Nginx configuration loaded successfully"
    },
    {
      id: "3",
      container: "postgres",
      timestamp: "2024-01-15 10:30:17",
      level: "info",
      message: "Database connection established"
    },
    {
      id: "4",
      container: "api-service",
      timestamp: "2024-01-15 10:30:18",
      level: "warn",
      message: "High memory usage detected: 85%"
    },
    {
      id: "5",
      container: "redis",
      timestamp: "2024-01-15 10:30:19",
      level: "info",
      message: "Redis server ready to accept connections"
    },
    {
      id: "6",
      container: "api-service",
      timestamp: "2024-01-15 10:30:20",
      level: "error",
      message: "Failed to connect to external API: timeout after 5000ms"
    },
    {
      id: "7",
      container: "cube-analytics",
      timestamp: "2024-01-15 10:30:21",
      level: "info",
      message: "Cube.js server is listening on port 4000"
    },
    {
      id: "8",
      container: "web-frontend",
      timestamp: "2024-01-15 10:30:22",
      level: "info",
      message: "Static assets compiled successfully"
    }
  ]);

  // Simulate real-time log updates
  useEffect(() => {
    if (!isLiveTail) return;

    const interval = setInterval(() => {
      const messages = [
        "Request processed successfully",
        "Cache hit for user session",
        "Database query executed in 45ms",
        "Memory usage: 72%",
        "Connection pool status: 8/10 active",
        "Scheduled task completed",
        "Health check passed",
        "Background job started"
      ];

      const levels: ("info" | "warn" | "error" | "debug")[] = ["info", "info", "info", "warn", "error"];
      const containerIds = containers.filter(c => c.status === "running").map(c => c.id);
      
      if (containerIds.length > 0) {
        const newLog: LogEntry = {
          id: Date.now().toString(),
          container: containerIds[Math.floor(Math.random() * containerIds.length)],
          timestamp: new Date().toLocaleString(),
          level: levels[Math.floor(Math.random() * levels.length)],
          message: messages[Math.floor(Math.random() * messages.length)]
        };

        setLogs(prev => [...prev.slice(-49), newLog]); // Keep last 50 logs
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isLiveTail, containers]);

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    if (isLiveTail && logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs, isLiveTail]);

  const filteredLogs = logs.filter(log => {
    const matchesContainer = selectedContainer === "all" || log.container === selectedContainer;
    const matchesLevel = selectedLevel === "all" || log.level === selectedLevel;
    const matchesSearch = !searchQuery || 
      log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.container.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesContainer && matchesLevel && matchesSearch;
  });

  const getLevelIcon = (level: string) => {
    switch (level) {
      case "error":
        return <AlertCircle className="h-3 w-3 status-error" />;
      case "warn":
        return <AlertTriangle className="h-3 w-3 status-warning" />;
      case "info":
        return <Info className="h-3 w-3 text-blue-400" />;
      case "debug":
        return <Terminal className="h-3 w-3 text-gray-400" />;
      default:
        return <Info className="h-3 w-3 text-gray-400" />;
    }
  };

  const getLevelBadge = (level: string) => {
    const variants = {
      error: "bg-red-500/20 text-red-400 border-red-500/50",
      warn: "bg-yellow-500/20 text-yellow-400 border-yellow-500/50",
      info: "bg-blue-500/20 text-blue-400 border-blue-500/50",
      debug: "bg-gray-500/20 text-gray-400 border-gray-500/50"
    };
    
    return (
      <Badge 
        variant="outline" 
        className={`${variants[level as keyof typeof variants]} text-xs`}
      >
        {level}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card className="metric-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Terminal className="h-5 w-5 text-primary" />
            Log Viewer
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px] relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10"
              />
            </div>
            
            <Select value={selectedContainer} onValueChange={setSelectedContainer}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select container" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Containers</SelectItem>
                {containers.map(container => (
                  <SelectItem key={container.id} value={container.id}>
                    {container.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Log level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="error">Error</SelectItem>
                <SelectItem value="warn">Warning</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="debug">Debug</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsLiveTail(!isLiveTail)}
                className={isLiveTail ? "border-primary" : ""}
              >
                {isLiveTail ? <Eye className="h-4 w-4 mr-2" /> : <EyeOff className="h-4 w-4 mr-2" />}
                Live Tail
              </Button>
              <Badge variant="outline">
                {filteredLogs.length} logs
              </Badge>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Trash2 className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Log Display */}
      <Card className="metric-card">
        <CardContent className="p-0">
          <div className="h-96 overflow-y-auto custom-scrollbar bg-black/20 font-mono text-sm">
            <div className="p-4 space-y-1">
              {filteredLogs.map((log) => (
                <div 
                  key={log.id} 
                  className="flex items-start gap-3 p-2 rounded hover:bg-card/50 transition-colors"
                >
                  <div className="flex items-center gap-2 min-w-[120px] text-xs text-muted-foreground">
                    {log.timestamp}
                  </div>
                  
                  <div className="flex items-center gap-2 min-w-[100px]">
                    {getLevelBadge(log.level)}
                  </div>
                  
                  <div className="min-w-[120px] text-xs">
                    <Badge variant="outline" className="text-xs">
                      {containers.find(c => c.id === log.container)?.name || log.container}
                    </Badge>
                  </div>
                  
                  <div className="flex-1 text-sm">
                    <span className={
                      log.level === "error" ? "text-red-400" :
                      log.level === "warn" ? "text-yellow-400" :
                      log.level === "info" ? "text-blue-400" :
                      "text-gray-400"
                    }>
                      {log.message}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={logEndRef} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}