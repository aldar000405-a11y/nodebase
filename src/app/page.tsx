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
      <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gray-50">
        <div className="w-full max-w-md text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Workflow Dashboard</h1>
          {dbError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800 font-medium">{dbError}</p>
              <p className="text-red-600 text-sm mt-2">Check your Neon database connection.</p>
            </div>
          )}
          <p className="text-gray-600 mb-6">You need to be logged in to access this page.</p>
          <Link href="/login" className="inline-block w-full">
            <Button className="w-full" variant="default">Go to Login</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Workflow Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage and monitor your workflows</p>
            </div>
            <LogoutButton />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Workflows Card */}
          <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-orange-500">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Workflows</p>
                <p className="text-4xl font-bold text-gray-900 mt-2">{workflows.length}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
            </div>
            {loading && <p className="text-gray-500 text-sm">Loading...</p>}
          </div>

          {/* Actions Card */}
          <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-blue-500">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-gray-600 text-sm font-medium">Quick Actions</p>
                <p className="text-gray-900 mt-2">Create and manage workflows</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">⚙️</span>
              </div>
            </div>
          </div>
        </div>

        {/* Workflows List Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Your Workflows</h2>
          {loading && (
            <p className="text-gray-500 py-8 text-center">
              <span className="inline-block animate-spin">⏳</span> Loading workflows...
            </p>
          )}
          {!loading && workflows.length > 0 ? (
            <div className="overflow-x-auto">
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-auto max-h-80 font-mono">
                {JSON.stringify(workflows, null, 2)}
              </pre>
            </div>
          ) : !loading && (
            <div className="text-center py-8">
              <p className="text-gray-500">No workflows yet. Create one to get started!</p>
            </div>
          )}
        </div>

        {/* AI Result Section */}
        {aiResult && (
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="text-2xl">✅</div>
              <div className="flex-1">
                <p className="font-bold text-blue-900 mb-2">AI Execution Triggered</p>
                <pre className="bg-white border border-blue-200 p-4 rounded text-blue-800 text-sm max-h-80 overflow-auto font-mono">
                  {JSON.stringify(aiResult, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Button
            disabled={createLoading}
            onClick={handleCreateWorkflow}
            className="w-full text-base py-6"
            variant="default"
          >
            {createLoading ? (
              <>
                <span className="inline-block animate-spin mr-2">⏳</span>
                Creating Workflow...
              </>
            ) : (
              <>
                <span className="mr-2">➕</span>
                Create Workflow
              </>
            )}
          </Button>

          <Button
            disabled={aiLoading}
            onClick={handleTestAI}
            className="w-full text-base py-6"
            variant="secondary"
          >
            {aiLoading ? (
              <>
                <span className="inline-block animate-spin mr-2">⏳</span>
                Testing AI...
              </>
            ) : (
              <>
                <span className="mr-2">🤖</span>
                Test AI
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Page;


