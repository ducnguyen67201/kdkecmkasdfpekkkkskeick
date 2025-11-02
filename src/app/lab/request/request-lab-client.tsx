"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Send, Shield, Clock, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { ScrollArea } from "~/components/ui/scroll-area";

interface Message {
  id: string;
  role: "user" | "bot";
  content: string;
  timestamp: Date;
}

interface LabBlueprint {
  cve: string;
  product: string;
  version: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  estimatedTime: string;
  cost: number;
}

export function RequestLabClient() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "bot",
      content:
        "Hello! What CVE would you like to test today? You can describe your needs or pick from recent CVEs below.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [blueprint, setBlueprint] = useState<LabBlueprint | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Mock recent CVEs for quick-pick
  const recentCVEs = [
    {
      id: "CVE-2023-36212",
      name: "TotalCMS File Upload",
      severity: "CRITICAL" as const,
    },
    {
      id: "CVE-2024-1234",
      name: "Apache Log4j RCE",
      severity: "CRITICAL" as const,
    },
    {
      id: "CVE-2024-5678",
      name: "WordPress SQL Injection",
      severity: "HIGH" as const,
    },
    {
      id: "CVE-2023-9999",
      name: "Nginx Path Traversal",
      severity: "MEDIUM" as const,
    },
  ];

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsProcessing(true);

    // Simulate LLM processing
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "bot",
        content: "I've analyzed your request. Here's what I found:",
        timestamp: new Date(),
      };

      // Mock blueprint creation
      const mockBlueprint: LabBlueprint = {
        cve: "CVE-2023-36212",
        product: "TotalCMS",
        version: "1.7.4",
        severity: "CRITICAL",
        estimatedTime: "2h",
        cost: 1,
      };

      setMessages((prev) => [...prev, botMessage]);
      setBlueprint(mockBlueprint);
      setIsProcessing(false);
    }, 1500);
  };

  const handleQuickPick = (cveId: string) => {
    setInput(`I want to test ${cveId}`);
  };

  const handleConfirmRequest = () => {
    if (!blueprint) return;
    // Navigate to preview page with blueprint data
    router.push(
      `/lab/preview?cve=${blueprint.cve}&product=${blueprint.product}&version=${blueprint.version}`,
    );
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "CRITICAL":
        return "bg-red-500 hover:bg-red-600";
      case "HIGH":
        return "bg-orange-500 hover:bg-orange-600";
      case "MEDIUM":
        return "bg-yellow-500 hover:bg-yellow-600";
      case "LOW":
        return "bg-blue-500 hover:bg-blue-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Request New Lab</h2>
          <p className="text-muted-foreground">
            Describe the CVE you want to test, and we&apos;ll prepare your
            environment
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Main Chat Area */}
        <div className="lg:col-span-2">
          <Card className="h-[600px]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Lab Request Chat
              </CardTitle>
            </CardHeader>
            <CardContent className="flex h-[calc(100%-80px)] flex-col">
              {/* Messages */}
              <ScrollArea className="mb-4 flex-1 pr-4">
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          msg.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <p className="text-sm">{msg.content}</p>
                        <span className="mt-1 block text-xs opacity-60">
                          {msg.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  ))}

                  {/* Blueprint Card */}
                  {blueprint && (
                    <Card className="border-green-500/50 bg-green-50 dark:bg-green-950/20">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-sm">
                          <Zap className="h-4 w-4" />
                          Lab Blueprint Created
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">CVE:</span>
                          <Badge variant="outline">{blueprint.cve}</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Target:</span>
                          <span className="font-medium">
                            {blueprint.product} v{blueprint.version}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">
                            Severity:
                          </span>
                          <Badge
                            className={getSeverityColor(blueprint.severity)}
                          >
                            {blueprint.severity}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">
                            Estimated Time:
                          </span>
                          <span className="font-medium">
                            {blueprint.estimatedTime}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Cost:</span>
                          <span className="font-medium">
                            {blueprint.cost} credit
                          </span>
                        </div>
                        <div className="mt-4 flex gap-2">
                          <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => setBlueprint(null)}
                          >
                            Edit Inputs
                          </Button>
                          <Button
                            className="flex-1"
                            onClick={handleConfirmRequest}
                          >
                            Confirm Request
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {isProcessing && (
                    <div className="flex justify-start">
                      <div className="bg-muted rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <div className="bg-primary h-2 w-2 animate-bounce rounded-full"></div>
                          <div className="bg-primary h-2 w-2 animate-bounce rounded-full delay-100"></div>
                          <div className="bg-primary h-2 w-2 animate-bounce rounded-full delay-200"></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Quick Pick CVEs */}
              <div className="mb-4">
                <p className="text-muted-foreground mb-2 text-xs">Quick Pick</p>
                <div className="flex flex-wrap gap-2">
                  {recentCVEs.map((cve) => (
                    <Button
                      key={cve.id}
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() => handleQuickPick(cve.id)}
                    >
                      <Badge
                        className={`mr-2 ${getSeverityColor(cve.severity)}`}
                      >
                        {cve.severity}
                      </Badge>
                      {cve.id}: {cve.name}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Input Area */}
              <div className="flex gap-2">
                <Input
                  placeholder="Describe what you want to test..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      void handleSendMessage();
                    }
                  }}
                />
                <Button
                  onClick={() => void handleSendMessage()}
                  disabled={isProcessing}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Guardrails Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Guardrails
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-card rounded-lg border p-3">
                <div className="mb-2 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium">Active Labs</span>
                </div>
                <p className="text-2xl font-bold">0 / 1</p>
                <p className="text-muted-foreground text-xs">
                  You can spawn 1 lab at a time
                </p>
              </div>

              <div className="bg-card rounded-lg border p-3">
                <div className="mb-2 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">Severity Gate</span>
                </div>
                <p className="text-muted-foreground text-xs">
                  HIGH & CRITICAL CVEs require manual approval
                </p>
              </div>

              <div className="bg-card rounded-lg border p-3">
                <div className="mb-2 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">Default TTL</span>
                </div>
                <p className="text-2xl font-bold">4 hours</p>
                <p className="text-muted-foreground text-xs">
                  Labs auto-terminate after TTL
                </p>
              </div>

              <div className="rounded-lg border border-amber-500/50 bg-amber-50 p-3 dark:bg-amber-950/20">
                <p className="text-xs font-medium text-amber-600 dark:text-amber-400">
                  💡 Pro Tip
                </p>
                <p className="mt-1 text-xs text-amber-900 dark:text-amber-100/80">
                  Be specific about the product version and environment you need
                  for accurate provisioning.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Manual Form Fallback */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-sm">Manual Form</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-muted-foreground mb-1 block text-xs">
                  CVE ID
                </label>
                <Input placeholder="CVE-2023-XXXXX" className="text-sm" />
              </div>
              <div>
                <label className="text-muted-foreground mb-1 block text-xs">
                  Product
                </label>
                <Input placeholder="e.g., TotalCMS" className="text-sm" />
              </div>
              <div>
                <label className="text-muted-foreground mb-1 block text-xs">
                  Version
                </label>
                <Input placeholder="e.g., 1.7.4" className="text-sm" />
              </div>
              <div>
                <label className="text-muted-foreground mb-1 block text-xs">
                  Additional Notes
                </label>
                <Textarea
                  placeholder="Any specific requirements..."
                  className="text-sm"
                  rows={3}
                />
              </div>
              <Button variant="secondary" className="w-full">
                Submit Manual Request
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
