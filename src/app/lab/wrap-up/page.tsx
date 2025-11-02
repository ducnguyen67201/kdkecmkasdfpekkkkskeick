"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Clock,
  FileText,
  Package,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { Progress } from "~/components/ui/progress";

interface Artifact {
  id: string;
  name: string;
  type: "screenshot" | "pcap" | "log" | "exploit";
  size: string;
  timestamp: Date;
}

export default function SessionWrapUpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const labId = searchParams.get("id") ?? "4821";

  const [notes, setNotes] = useState("");
  const [uptime] = useState("01:47:13");
  const [isEnding, setIsEnding] = useState(false);
  const [teardownProgress, setTeardownProgress] = useState(0);
  const [showTeardownModal, setShowTeardownModal] = useState(false);

  const [artifacts] = useState<Artifact[]>([
    {
      id: "1",
      name: "exploit_poc.py",
      type: "exploit",
      size: "2.4 KB",
      timestamp: new Date(Date.now() - 3600000),
    },
    {
      id: "2",
      name: "upload_response.pcap",
      type: "pcap",
      size: "145 KB",
      timestamp: new Date(Date.now() - 2400000),
    },
    {
      id: "3",
      name: "server_logs.txt",
      type: "log",
      size: "8.1 KB",
      timestamp: new Date(Date.now() - 1800000),
    },
    {
      id: "4",
      name: "rce_proof.png",
      type: "screenshot",
      size: "234 KB",
      timestamp: new Date(Date.now() - 600000),
    },
  ]);

  // Simulate teardown progress
  useEffect(() => {
    if (!showTeardownModal) return;

    const interval = setInterval(() => {
      setTeardownProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          // Navigate to evidence page after completion
          setTimeout(() => {
            router.push(`/lab/evidence?id=${labId}`);
          }, 1000);
          return 100;
        }
        return prev + 10;
      });
    }, 300);

    return () => clearInterval(interval);
  }, [showTeardownModal, labId, router]);

  const handleRequestExtension = () => {
    alert("Extension request sent! (Feature not implemented in demo)");
  };

  const handleEndSession = () => {
    setIsEnding(true);
    // Simulate validation
    setTimeout(() => {
      setShowTeardownModal(true);
      setIsEnding(false);
    }, 1500);
  };

  const getArtifactIcon = (type: Artifact["type"]) => {
    switch (type) {
      case "screenshot":
        return "📸";
      case "pcap":
        return "📡";
      case "log":
        return "📋";
      case "exploit":
        return "⚡";
    }
  };

  return (
    <div className="container mx-auto min-h-screen bg-background p-4">
      <div className="mx-auto max-w-4xl py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold">Session Summary</h1>
          <p className="mt-2 text-muted-foreground">
            Lab #{labId} - Review and collect your evidence
          </p>
        </div>

        {/* Session Stats */}
        <div className="mb-6 grid gap-4 md:grid-cols-2">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Clock className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Uptime</p>
                  <p className="text-2xl font-bold">{uptime}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Evidence Artifacts</p>
                  <p className="text-2xl font-bold">
                    {artifacts.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Evidence Artifacts */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Collected Evidence
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {artifacts.map((artifact) => (
                <div
                  key={artifact.id}
                  className="flex items-center justify-between rounded-lg border bg-card p-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getArtifactIcon(artifact.type)}</span>
                    <div>
                      <p className="font-medium">{artifact.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {artifact.size} •{" "}
                        {artifact.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline">
                    {artifact.type}
                  </Badge>
                </div>
              ))}
            </div>

            {artifacts.length === 0 && (
              <div className="py-8 text-center text-muted-foreground">
                <FileText className="mx-auto mb-2 h-12 w-12 opacity-30" />
                <p>No evidence artifacts collected</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Notes */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Session Notes (Optional)</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Add any observations, findings, or notes about this testing session..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[120px]"
            />
            <p className="mt-2 text-xs text-muted-foreground">
              These notes will be included in your evidence package
            </p>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button
            variant="outline"
            className="flex-1"
            onClick={handleRequestExtension}
            disabled={isEnding}
          >
            Request Extension
          </Button>
          <Button
            variant="destructive"
            className="flex-1"
            onClick={handleEndSession}
            disabled={isEnding}
          >
            {isEnding ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Preparing...
              </>
            ) : (
              "End and Collect Evidence"
            )}
          </Button>
        </div>

        {/* Teardown Modal */}
        {showTeardownModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle className="text-center">
                  {teardownProgress < 100
                    ? "Tearing Down Lab"
                    : "Packaging Evidence"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col items-center gap-4">
                  {teardownProgress < 100 ? (
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                  ) : (
                    <CheckCircle2 className="h-12 w-12 text-green-500" />
                  )}

                  <div className="w-full">
                    <div className="mb-2 flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{teardownProgress}%</span>
                    </div>
                    <Progress value={teardownProgress} />
                  </div>

                  <div className="text-center text-sm text-muted-foreground">
                    {teardownProgress < 30 && "Stopping containers..."}
                    {teardownProgress >= 30 &&
                      teardownProgress < 60 &&
                      "Cleaning up resources..."}
                    {teardownProgress >= 60 &&
                      teardownProgress < 90 &&
                      "Collecting evidence..."}
                    {teardownProgress >= 90 &&
                      teardownProgress < 100 &&
                      "Generating report..."}
                    {teardownProgress === 100 && "Complete! Redirecting..."}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
