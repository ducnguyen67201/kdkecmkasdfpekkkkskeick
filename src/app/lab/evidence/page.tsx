"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Download,
  Mail,
  CheckCircle2,
  Copy,
  Shield,
  FileText,
  Archive,
  Key,
  RotateCcw,
  Home,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

interface EvidenceFile {
  name: string;
  description: string;
  size: string;
  hash: string;
  icon: React.ReactNode;
}

export default function EvidenceDeliveryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const labId = searchParams.get("id") ?? "4821";

  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);
  const [emailAddress, setEmailAddress] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const downloadLink = `https://octolab.example.com/evidence/lab-${labId}-evidence.zip`;
  const packageHash =
    "sha256:a3f8b9c2d1e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0";

  const evidenceFiles: EvidenceFile[] = [
    {
      name: "report.json",
      description: "Structured test report with findings",
      size: "12.4 KB",
      hash: "abc123...",
      icon: <FileText className="h-5 w-5 text-blue-400" />,
    },
    {
      name: "evidence.zip",
      description: "All collected artifacts and logs",
      size: "387 KB",
      hash: "def456...",
      icon: <Archive className="h-5 w-5 text-purple-400" />,
    },
    {
      name: "signature.pem",
      description: "PKI digital signature for verification",
      size: "1.2 KB",
      hash: "ghi789...",
      icon: <Key className="h-5 w-5 text-green-400" />,
    },
  ];

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(downloadLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyHash = async () => {
    await navigator.clipboard.writeText(packageHash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handleEmailCustomer = () => {
    if (!emailAddress) {
      alert("Please enter an email address");
      return;
    }
    // Simulate sending email
    setEmailSent(true);
    setTimeout(() => {
      alert(`Evidence package sent to ${emailAddress}`);
    }, 500);
  };

  const handleDownload = () => {
    alert("Download started! (Demo mode - no actual file)");
  };

  const handleRerun = () => {
    router.push("/lab/request");
  };

  const handleHome = () => {
    router.push("/");
  };

  return (
    <div className="container mx-auto min-h-screen bg-gradient-to-b from-[#2e026d] to-[#15162c] p-4 text-white">
      <div className="mx-auto max-w-4xl py-8">
        {/* Success Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-green-500/20 p-4">
              <CheckCircle2 className="h-16 w-16 text-green-400" />
            </div>
          </div>
          <h1 className="text-4xl font-bold">Export Package Ready</h1>
          <p className="mt-2 text-white/70">
            Lab #{labId} - Your evidence has been securely packaged
          </p>
        </div>

        {/* Package Contents */}
        <Card className="mb-6 border-white/10 bg-white/5 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Archive className="h-5 w-5" />
              Package Contents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {evidenceFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-4"
                >
                  <div className="flex items-center gap-3">
                    {file.icon}
                    <div>
                      <p className="font-medium text-white">{file.name}</p>
                      <p className="text-sm text-white/60">
                        {file.description}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-white">
                      {file.size}
                    </p>
                    <p className="text-xs text-white/50">
                      {file.hash.slice(0, 12)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Download Section */}
        <Card className="mb-6 border-white/10 bg-white/5 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Download className="h-5 w-5" />
              Download Package
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="mb-2 block text-sm text-white/70">
                Download Link
              </label>
              <div className="flex gap-2">
                <Input
                  value={downloadLink}
                  readOnly
                  className="border-white/20 bg-white/10 text-white"
                />
                <Button
                  variant="outline"
                  className="border-white/20 bg-white/5 hover:bg-white/10"
                  onClick={() => void handleCopyLink()}
                >
                  {copiedLink ? (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
              <p className="mt-2 text-xs text-white/50">
                Link expires in 7 days
              </p>
            </div>

            <Button
              className="w-full bg-[hsl(280,100%,70%)] hover:bg-[hsl(280,100%,80%)]"
              onClick={handleDownload}
            >
              <Download className="mr-2 h-4 w-4" />
              Download Evidence Package
            </Button>
          </CardContent>
        </Card>

        {/* Email to Customer */}
        <Card className="mb-6 border-white/10 bg-white/5 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Mail className="h-5 w-5" />
              Email to Customer
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="mb-2 block text-sm text-white/70">
                Customer Email Address
              </label>
              <Input
                type="email"
                placeholder="customer@example.com"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
                className="border-white/20 bg-white/10 text-white placeholder:text-white/50"
              />
            </div>

            <Button
              variant="outline"
              className="w-full border-white/20 bg-white/5 hover:bg-white/10"
              onClick={handleEmailCustomer}
              disabled={emailSent}
            >
              {emailSent ? (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4 text-green-400" />
                  Email Sent Successfully
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Send Evidence Package
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Integrity Verification */}
        <Card className="mb-6 border-green-500/30 bg-green-950/20 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Shield className="h-5 w-5 text-green-400" />
              Integrity Verification
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-400" />
              <div className="flex-1">
                <p className="font-medium text-white">PKI Signature Verified</p>
                <p className="text-sm text-white/70">
                  Package has been digitally signed and verified
                </p>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm text-white/70">
                Package Hash (SHA-256)
              </label>
              <div className="flex gap-2">
                <Input
                  value={packageHash}
                  readOnly
                  className="border-white/20 bg-white/10 font-mono text-xs text-white"
                />
                <Button
                  variant="outline"
                  className="border-white/20 bg-white/5 hover:bg-white/10"
                  onClick={() => void handleCopyHash()}
                >
                  {copiedHash ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="mt-2 text-xs text-white/50">
                Use this hash to verify package integrity
              </p>
            </div>

            <div className="rounded-lg border border-green-500/30 bg-green-950/20 p-3">
              <p className="text-sm text-green-400">
                ✓ All evidence files are tamper-proof and cryptographically
                signed
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button
            variant="outline"
            className="flex-1 border-white/20 bg-white/5 hover:bg-white/10"
            onClick={handleRerun}
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Re-run Lab
          </Button>
          <Button
            className="flex-1 bg-[hsl(280,100%,70%)] hover:bg-[hsl(280,100%,80%)]"
            onClick={handleHome}
          >
            <Home className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </div>

        {/* Help Text */}
        <p className="mt-6 text-center text-sm text-white/50">
          Evidence package will be retained for 30 days. Download and backup
          your evidence promptly.
        </p>
      </div>
    </div>
  );
}
