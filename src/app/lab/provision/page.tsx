"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  Circle,
  Loader2,
  XCircle,
  Clock,
  Terminal,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Progress } from "~/components/ui/progress";

type StepStatus = "pending" | "running" | "done" | "failed";

interface ProvisionStep {
  id: number;
  name: string;
  status: StepStatus;
  progress?: number;
  eta?: string;
}

interface LogEntry {
  timestamp: string;
  message: string;
  type: "info" | "success" | "error";
}

export default function ProvisionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const labId = searchParams.get("id") ?? "4821";

  const [steps, setSteps] = useState<ProvisionStep[]>([
    { id: 1, name: "Resolve blueprint", status: "pending" },
    { id: 2, name: "Build container bundle", status: "pending", progress: 0 },
    { id: 3, name: "Pull dependencies", status: "pending" },
    { id: 4, name: "Run smoke tests", status: "pending" },
    { id: 5, name: "Configure networking", status: "pending" },
  ]);

  const [logs, setLogs] = useState<LogEntry[]>([
    {
      timestamp: "14:32:01",
      message: "Provisioning request received",
      type: "info",
    },
    {
      timestamp: "14:32:02",
      message: "Validating blueprint configuration...",
      type: "info",
    },
  ]);

  const [overallETA] = useState("~3 min");
  const [isCancelled, setIsCancelled] = useState(false);

  // Simulate provisioning progress
  useEffect(() => {
    if (isCancelled) return;

    const interval = setInterval(() => {
      setSteps((prevSteps) => {
        const newSteps = [...prevSteps];
        const runningIndex = newSteps.findIndex((s) => s.status === "running");

        if (runningIndex !== -1) {
          // Update progress for running step
          const step = newSteps[runningIndex];
          if (!step) return newSteps;

          if (step.progress !== undefined && step.progress < 100) {
            step.progress = Math.min(100, step.progress + 10);

            // Add log entry
            if (step.progress === 50) {
              setLogs((prev) => [
                ...prev,
                {
                  timestamp: new Date().toLocaleTimeString("en-US", {
                    hour12: false,
                  }),
                  message: `${step.name} - 50% complete`,
                  type: "info",
                },
              ]);
            }

            if (step.progress === 100) {
              step.status = "done";
              setLogs((prev) => [
                ...prev,
                {
                  timestamp: new Date().toLocaleTimeString("en-US", {
                    hour12: false,
                  }),
                  message: `${step.name} completed successfully`,
                  type: "success",
                },
              ]);
            }
          } else if (!step.progress) {
            // Steps without progress
            const runningStep = newSteps[runningIndex];
            if (runningStep) {
              setTimeout(() => {
                runningStep.status = "done";
                setLogs((prev) => [
                  ...prev,
                  {
                    timestamp: new Date().toLocaleTimeString("en-US", {
                      hour12: false,
                    }),
                    message: `${runningStep.name} completed successfully`,
                    type: "success",
                  },
                ]);
              }, 2000);
            }
          }
        } else {
          // Start next step
          const nextPendingIndex = newSteps.findIndex(
            (s) => s.status === "pending",
          );
          if (nextPendingIndex !== -1) {
            const nextStep = newSteps[nextPendingIndex];
            if (nextStep) {
              nextStep.status = "running";
              setLogs((prev) => [
                ...prev,
                {
                  timestamp: new Date().toLocaleTimeString("en-US", {
                    hour12: false,
                  }),
                  message: `Starting: ${nextStep.name}`,
                  type: "info",
                },
              ]);
            }
          } else {
            // All done!
            const allDone = newSteps.every((s) => s.status === "done");
            if (allDone) {
              setLogs((prev) => [
                ...prev,
                {
                  timestamp: new Date().toLocaleTimeString("en-US", {
                    hour12: false,
                  }),
                  message: "Lab provisioning completed successfully!",
                  type: "success",
                },
              ]);
              setTimeout(() => {
                router.push(`/lab/session?id=${labId}`);
              }, 2000);
            }
          }
        }

        return newSteps;
      });
    }, 800);

    return () => clearInterval(interval);
  }, [isCancelled, labId, router]);

  const handleCancel = () => {
    setIsCancelled(true);
    setSteps((prev) =>
      prev.map((step) => ({
        ...step,
        status: step.status === "done" ? "done" : "failed",
      })),
    );
    setLogs((prev) => [
      ...prev,
      {
        timestamp: new Date().toLocaleTimeString("en-US", { hour12: false }),
        message: "Provisioning cancelled by user",
        type: "error",
      },
    ]);
  };

  const getStepIcon = (status: StepStatus) => {
    switch (status) {
      case "done":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "running":
        return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />;
      case "failed":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Circle className="text-muted-foreground h-5 w-5" />;
    }
  };

  const completedSteps = steps.filter((s) => s.status === "done").length;
  const totalSteps = steps.length;
  const overallProgress = (completedSteps / totalSteps) * 100;

  return (
    <div className="bg-background container mx-auto min-h-screen p-4">
      <div className="mx-auto max-w-5xl py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold">Provisioning Lab #{labId}</h1>
              <p className="text-muted-foreground mt-2">
                Setting up your testing environment...
              </p>
            </div>
            <Badge variant="outline" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              ETA: {overallETA}
            </Badge>
          </div>

          {/* Overall Progress Bar */}
          <div className="mt-6">
            <div className="mb-2 flex justify-between text-sm">
              <span className="text-muted-foreground">
                Overall Progress: {completedSteps} / {totalSteps} steps
              </span>
              <span className="font-medium">
                {Math.round(overallProgress)}%
              </span>
            </div>
            <Progress value={overallProgress} />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Steps Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Provisioning Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex items-start gap-3">
                    <div className="mt-0.5">{getStepIcon(step.status)}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p
                          className={`font-medium ${
                            step.status === "running"
                              ? ""
                              : step.status === "done"
                                ? "text-green-500"
                                : step.status === "failed"
                                  ? "text-red-500"
                                  : "text-muted-foreground"
                          }`}
                        >
                          {index + 1}/5 {step.name}
                        </p>
                        {step.status === "running" &&
                          step.progress !== undefined && (
                            <span className="text-muted-foreground text-sm">
                              {step.progress}%
                            </span>
                          )}
                      </div>
                      {step.status === "running" &&
                        step.progress !== undefined && (
                          <Progress
                            value={step.progress}
                            className="mt-2 h-1"
                          />
                        )}
                    </div>
                  </div>
                ))}
              </div>

              {!isCancelled && completedSteps < totalSteps && (
                <Button
                  variant="destructive"
                  className="mt-6 w-full"
                  onClick={handleCancel}
                >
                  Cancel Request
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Live Logs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Terminal className="h-5 w-5" />
                Live Logs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="bg-muted/30 h-[400px] rounded-lg border p-4 font-mono text-xs">
                <div className="space-y-1">
                  {logs.map((log, index) => (
                    <div key={index} className="flex gap-2">
                      <span className="text-muted-foreground">
                        [{log.timestamp}]
                      </span>
                      <span
                        className={
                          log.type === "success"
                            ? "text-green-500"
                            : log.type === "error"
                              ? "text-red-500"
                              : ""
                        }
                      >
                        {log.message}
                      </span>
                    </div>
                  ))}
                  {!isCancelled && completedSteps < totalSteps && (
                    <div className="flex animate-pulse gap-2">
                      <span className="text-muted-foreground">
                        [
                        {new Date().toLocaleTimeString("en-US", {
                          hour12: false,
                        })}
                        ]
                      </span>
                      <span>Processing...</span>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {isCancelled && (
                <div className="mt-4 rounded-lg border border-red-500/50 bg-red-50 p-3 dark:bg-red-950/20">
                  <div className="flex gap-2">
                    <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-500" />
                    <div className="text-sm">
                      <p className="font-semibold text-red-600 dark:text-red-400">
                        Provisioning Cancelled
                      </p>
                      <p className="mt-1 text-red-900 dark:text-red-100/70">
                        Your lab request has been cancelled. Resources are being
                        cleaned up.
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-3"
                        onClick={() => router.push("/lab/request")}
                      >
                        Start New Request
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Help Text */}
        <p className="text-muted-foreground mt-6 text-center text-sm">
          This process typically takes 2-4 minutes. You&apos;ll be redirected
          automatically when ready.
        </p>
      </div>
    </div>
  );
}
