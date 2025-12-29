"use client";
import { LogoutButton } from "../components/logout";
import { useState, useEffect } from "react";
import { useTRPC } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";

const Page = () => {
  const trpc = useTRPC();
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [dbError, setDbError] = useState<string | null>(null);

  // Load workflows
  const loadWorkflows = async () => {
    setLoading(true);
    setDbError(null);
    try {
      const result = await trpc.getWorkflows.query();
      setWorkflows(Array.isArray(result) ? result : []);
      setIsAuthenticated(true);
    } catch (error: any) {
      console.error("Load workflows error:", error);
      
      // Check for database connection errors
      if (error?.message?.includes("ECONNREFUSED") || 
          error?.message?.includes("Can't reach database")) {
        setDbError("🔴 Database connection failed. Is Neon available?");
        setIsAuthenticated(false);
        return;
      }
      
      if (error?.message?.includes("UNAUTHORIZED") || error?.data?.code === "UNAUTHORIZED") {
        setIsAuthenticated(false);
        return;
      }
      
      toast.error((error as any)?.message || "Failed to load workflows");
    } finally {
      setLoading(false);
    }
  };

  // Test AI
  const handleTestAI = async () => {
    setAiLoading(true);
    try {
      const result = await trpc.testAI.mutate();
      setAiResult(result);
      toast.success("✅ AI test triggered successfully!");
    } catch (error: any) {
      console.error("Test AI error:", error);
      toast.error((error as any)?.message || "Failed to test AI");
    } finally {
      setAiLoading(false);
    }
  };

  // Create Workflow
  const handleCreateWorkflow = async () => {
    setCreateLoading(true);
    try {
      const result = await trpc.createWorkflow.mutate();
      toast.success("Workflow created successfully!");
      await loadWorkflows();
    } catch (error: any) {
      console.error("Create workflow error:", error);
      toast.error((error as any)?.message || "Failed to create workflow");
    } finally {
      setCreateLoading(false);
    }
  };

  // Load on mount
  useEffect(() => {
    loadWorkflows();
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen min-w-screen flex items-center justify-center flex-col gap-y-4 p-4">
        <p className="text-lg font-semibold">Workflow Dashboard</p>
        {dbError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md text-center">
            <p className="text-red-800 font-medium">{dbError}</p>
            <p className="text-red-600 text-sm mt-2">Check your Neon database connection.</p>
          </div>
        )}
        <p className="text-gray-500">You need to be logged in to access this page.</p>
        <Link href="/login">
          <Button>Go to Login</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen min-w-screen flex items-center justify-center flex-col gap-y-6 p-4">
      <p className="text-lg font-semibold">Workflow Dashboard</p>

      {/* Workflows List */}
      <div className="w-full max-w-2xl">
        <h3 className="font-semibold mb-2">Your Workflows ({workflows.length})</h3>
        {loading && <p className="text-gray-500">Loading workflows...</p>}
        {workflows.length > 0 ? (
          <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto max-h-64">
            {JSON.stringify(workflows, null, 2)}
          </pre>
        ) : (
          <p className="text-gray-500">No workflows</p>
        )}
      </div>

      {/* Test AI Button */}
      <Button
        disabled={aiLoading}
        onClick={handleTestAI}
        className="w-full max-w-xs"
        variant="secondary"
      >
        {aiLoading ? "Testing AI..." : "Test AI"}
      </Button>

      {/* AI Result */}
      {aiResult && (
        <div className="max-w-2xl p-4 rounded-lg border bg-blue-50 border-blue-200">
          <p className="text-sm font-semibold mb-2 text-blue-900">
            ✅ AI Execution Triggered
          </p>
          <pre className="whitespace-pre-wrap text-blue-800 text-sm max-w-xl overflow-auto">
            {JSON.stringify(aiResult, null, 2)}
          </pre>
        </div>
      )}

      {/* Create Workflow Button */}
      <Button
        disabled={createLoading}
        onClick={handleCreateWorkflow}
        className="w-full max-w-xs"
        variant="secondary"
      >
        {createLoading ? "Creating..." : "Create Workflow"}
      </Button>

      {/* Logout */}
      <LogoutButton />
    </div>
  );
};

export default Page;


