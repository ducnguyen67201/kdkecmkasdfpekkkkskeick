"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Server,
  Package,
  User,
  Database,
  Clock,
  Coins,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";

interface BlueprintDetails {
  cve: string;
  product: string;
  version: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  blueprint: string;
  containerType: string;
  dependencies: string[];
  pocBundle: string;
  adminUser: string;
  dbUsername: string;
  dbPassword: string;
  estimatedTime: string;
  cost: number;
}

export default function LabPreviewPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isProvisioning, setIsProvisioning] = useState(false);

  // In a real app, this would come from the URL params or state management
  // For now, using mock data
  const blueprintDetails: BlueprintDetails = {
    cve: searchParams.get("cve") ?? "CVE-2023-36212",
    product: "TotalCMS",
    version: "1.7.4",
    severity: "CRITICAL",
    blueprint: "totalcms-web-1.7.4",
    containerType: "Docker Container",
    dependencies: ["Postgres 14", "php:8.1-apache", "nginx:1.21"],
    pocBundle: "File upload exploit (RCE)",
    adminUser: "pentester@octolab",
    dbUsername: "totalcms",
    dbPassword: "********",
    estimatedTime: "2h",
    cost: 1,
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

  const handleProvision = () => {
    setIsProvisioning(true);
    // Navigate to provisioning status page
    router.push("/lab/provision?id=4821");
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="container mx-auto min-h-screen bg-background p-4">
      <div className="mx-auto max-w-4xl py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Request
          </Button>
          <h1 className="text-4xl font-bold">Target Summary</h1>
          <p className="mt-2 text-muted-foreground">
            Review your lab configuration before provisioning
          </p>
        </div>

        {/* Main Preview Card */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl">
                  {blueprintDetails.product} v{blueprintDetails.version}
                </CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">
                  Testing {blueprintDetails.cve}
                </p>
              </div>
              <Badge className={getSeverityColor(blueprintDetails.severity)}>
                {blueprintDetails.severity}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Blueprint Section */}
            <div className="rounded-lg border bg-card p-4">
              <div className="mb-3 flex items-center gap-2">
                <Server className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Blueprint</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Name:</span>
                  <span className="font-mono">
                    {blueprintDetails.blueprint}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type:</span>
                  <span>
                    {blueprintDetails.containerType}
                  </span>
                </div>
              </div>
            </div>

            {/* Dependencies Section */}
            <div className="rounded-lg border bg-card p-4">
              <div className="mb-3 flex items-center gap-2">
                <Package className="h-5 w-5 text-blue-500" />
                <h3 className="font-semibold">Dependencies</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {blueprintDetails.dependencies.map((dep, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                  >
                    {dep}
                  </Badge>
                ))}
              </div>
            </div>

            {/* PoC Bundle Section */}
            <div className="rounded-lg border bg-card p-4">
              <div className="mb-3 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-500" />
                <h3 className="font-semibold">PoC Bundle</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                {blueprintDetails.pocBundle}
              </p>
            </div>

            {/* Config Details Section */}
            <div className="rounded-lg border border-green-500/30 bg-green-50 p-4 dark:bg-green-950/20">
              <div className="mb-3 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <h3 className="font-semibold">
                  Configuration Details
                </h3>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <User className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-muted-foreground">Admin User:</p>
                    <p className="font-mono">
                      {blueprintDetails.adminUser}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Database className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-muted-foreground">Database Credentials:</p>
                    <p className="font-mono">
                      {blueprintDetails.dbUsername} /{" "}
                      {blueprintDetails.dbPassword}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Resource Estimation */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg border bg-card p-4">
                <div className="mb-2 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-muted-foreground">
                    Estimated Run Time
                  </span>
                </div>
                <p className="text-2xl font-bold">
                  {blueprintDetails.estimatedTime}
                </p>
              </div>
              <div className="rounded-lg border bg-card p-4">
                <div className="mb-2 flex items-center gap-2">
                  <Coins className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm text-muted-foreground">Cost</span>
                </div>
                <p className="text-2xl font-bold">
                  {blueprintDetails.cost} credit
                  {blueprintDetails.cost !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            {/* Important Notice */}
            <div className="rounded-lg border border-amber-500/50 bg-amber-50 p-4 dark:bg-amber-950/20">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 flex-shrink-0 text-amber-500" />
                <div className="text-sm">
                  <p className="font-semibold text-amber-600 dark:text-amber-400">
                    Important Notice
                  </p>
                  <ul className="mt-2 space-y-1 text-amber-900 dark:text-amber-100/80">
                    <li>
                      • Lab will auto-terminate after the estimated run time
                    </li>
                    <li>
                      • All data will be wiped upon termination (save your
                      evidence!)
                    </li>
                    <li>
                      • Only one active lab allowed per user at a time
                    </li>
                    <li>
                      • {blueprintDetails.severity} severity requires approval
                      (auto-approved for demo)
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleBack}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button
                className="flex-1"
                onClick={handleProvision}
                disabled={isProvisioning}
              >
                {isProvisioning ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                    Provisioning...
                  </>
                ) : (
                  <>
                    <Server className="mr-2 h-4 w-4" />
                    Provision Lab
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Help Text */}
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Need to change something?{" "}
          <button
            onClick={handleBack}
            className="text-primary underline hover:text-primary/80"
          >
            Go back to modify your request
          </button>
        </p>
      </div>
    </div>
  );
}
