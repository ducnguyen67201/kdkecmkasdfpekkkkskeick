"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Terminal,
  Monitor,
  Download,
  Clock,
  Copy,
  Activity,
  User,
  AlertCircle,
  FileText,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { ScrollArea } from "~/components/ui/scroll-area";

interface ActivityLog {
  id: string;
  timestamp: Date;
  type: "session_join" | "command" | "file_upload" | "connection";
  message: string;
  user?: string;
}

export default function LabSessionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const labId = searchParams.get("id") ?? "4821";

  const [uptime, setUptime] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(14160); // 3h 56m in seconds
  const [activities, setActivities] = useState<ActivityLog[]>([
    {
      id: "1",
      timestamp: new Date(Date.now() - 180000),
      type: "session_join",
      message: "Session started",
      user: "pentester@octolab",
    },
    {
      id: "2",
      timestamp: new Date(Date.now() - 120000),
      type: "connection",
      message: "Connected to TotalCMS web interface",
    },
    {
      id: "3",
      timestamp: new Date(Date.now() - 60000),
      type: "command",
      message: "Executed: curl -X POST /upload",
    },
  ]);

  const [copiedSSH, setCopiedSSH] = useState(false);

  // Simulate uptime timer
  useEffect(() => {
    const interval = setInterval(() => {
      setUptime((prev) => prev + 1);
      setTimeRemaining((prev) => Math.max(0, prev - 1));

      // Add random activity
      if (Math.random() > 0.95) {
        const newActivity: ActivityLog = {
          id: Date.now().toString(),
          timestamp: new Date(),
          type: "command",
          message: `Executed: ${["ls -la", "cat /etc/passwd", "whoami", "ps aux"][Math.floor(Math.random() * 4)]}`,
        };
        setActivities((prev) => [newActivity, ...prev].slice(0, 20));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const formatTimeRemaining = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const handleCopySSH = async () => {
    await navigator.clipboard.writeText("ssh pentester@10.0.1.100");
    setCopiedSSH(true);
    setTimeout(() => setCopiedSSH(false), 2000);
  };

  const handleEndSession = () => {
    router.push(`/lab/wrap-up?id=${labId}`);
  };

  const getActivityIcon = (type: ActivityLog["type"]) => {
    switch (type) {
      case "session_join":
        return <User className="h-4 w-4 text-green-500" />;
      case "command":
        return <Terminal className="h-4 w-4 text-blue-500" />;
      case "file_upload":
        return <FileText className="text-primary h-4 w-4" />;
      case "connection":
        return <Activity className="h-4 w-4 text-yellow-500" />;
    }
  };

  return (
    <div className="bg-background container mx-auto min-h-screen p-4">
      <div className="mx-auto max-w-7xl py-8">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold">Lab Session #{labId}</h1>
            <p className="text-muted-foreground mt-2">
              CVE-2023-36212 - TotalCMS v1.7.4
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge className="bg-green-500 text-lg">
              <Clock className="mr-2 h-4 w-4" />
              Active
            </Badge>
            <div className="text-right text-sm">
              <p className="text-muted-foreground">
                Uptime: {formatTime(uptime)}
              </p>
              <p className="text-muted-foreground">
                Remaining: {formatTimeRemaining(timeRemaining)}
              </p>
            </div>
          </div>
        </div>

        {/* Warning if time is low */}
        {timeRemaining < 1800 && (
          <div className="mb-6 rounded-lg border border-amber-500/50 bg-amber-50 p-4 dark:bg-amber-950/20">
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 flex-shrink-0 text-amber-500" />
              <div className="text-sm">
                <p className="font-semibold text-amber-600 dark:text-amber-400">
                  Time Running Low
                </p>
                <p className="mt-1 text-amber-900 dark:text-amber-100/80">
                  Your session will auto-terminate in{" "}
                  {formatTimeRemaining(timeRemaining)}. Consider requesting an
                  extension or saving your evidence.
                </p>
                <Button size="sm" variant="outline" className="mt-2">
                  Request Extension
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Connections & Activity */}
          <div className="space-y-6 lg:col-span-1">
            {/* Connections */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Terminal className="h-5 w-5" />
                  Connections
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-card rounded-lg border p-4">
                  <h3 className="mb-2 font-semibold">Target: TotalCMS</h3>
                  <p className="text-muted-foreground mb-3 text-sm">
                    Web application on port 8080
                  </p>
                  <Button className="w-full">Open Browser Terminal</Button>
                </div>

                <div className="bg-card rounded-lg border p-4">
                  <h3 className="mb-2 font-semibold">Kali Linux Desktop</h3>
                  <p className="text-muted-foreground mb-3 text-sm">
                    Full desktop via Guacamole
                  </p>
                  <Button variant="outline" className="w-full">
                    Launch Desktop
                  </Button>
                </div>

                <div className="rounded-lg border border-green-500/30 bg-green-50 p-4 dark:bg-green-950/20">
                  <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-green-600 dark:text-green-400">
                    <Terminal className="h-4 w-4" />
                    Credentials
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-muted-foreground mb-1">SSH Access:</p>
                      <div className="flex items-center gap-2">
                        <code className="bg-muted flex-1 rounded px-2 py-1 text-xs">
                          ssh pentester@10.0.1.100
                        </code>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 w-7 p-0"
                          onClick={() => void handleCopySSH()}
                        >
                          {copiedSSH ? (
                            <span className="text-xs">✓</span>
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full border-white/20 text-xs"
                    >
                      <Download className="mr-2 h-3 w-3" />
                      Download VPN Config
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Activity Feed */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Activity Feed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px] pr-4">
                  <div className="space-y-3">
                    {activities.map((activity) => (
                      <div
                        key={activity.id}
                        className="bg-card flex gap-3 rounded-lg border p-3"
                      >
                        {getActivityIcon(activity.type)}
                        <div className="flex-1">
                          <p className="text-sm">{activity.message}</p>
                          {activity.user && (
                            <p className="text-muted-foreground text-xs">
                              {activity.user}
                            </p>
                          )}
                          <p className="text-muted-foreground text-xs">
                            {activity.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Guacamole Preview */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="h-5 w-5" />
                  Remote Access
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="terminal" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="terminal">
                      <Terminal className="mr-2 h-4 w-4" />
                      Browser Terminal
                    </TabsTrigger>
                    <TabsTrigger value="desktop">
                      <Monitor className="mr-2 h-4 w-4" />
                      Full Desktop
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="terminal" className="mt-4">
                    <div className="bg-muted/30 aspect-video rounded-lg border p-8">
                      <div className="flex h-full flex-col items-center justify-center gap-4">
                        <Terminal className="text-muted-foreground h-12 w-12" />
                        <p className="text-muted-foreground text-center">
                          Apache Guacamole terminal session
                          <br />
                          <span className="text-sm">
                            (Embedded iframe placeholder)
                          </span>
                        </p>
                        <Button>Launch Terminal Session</Button>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="desktop" className="mt-4">
                    <div className="bg-muted/30 aspect-video rounded-lg border p-8">
                      <div className="flex h-full flex-col items-center justify-center gap-4">
                        <Monitor className="text-muted-foreground h-12 w-12" />
                        <p className="text-muted-foreground text-center">
                          Apache Guacamole desktop session
                          <br />
                          <span className="text-sm">
                            (Embedded iframe placeholder)
                          </span>
                        </p>
                        <Button>Launch Desktop Session</Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Session Controls */}
                <div className="mt-6 flex gap-4">
                  <Button variant="outline" className="flex-1">
                    Request Extension
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={handleEndSession}
                  >
                    End Session & Collect Evidence
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
