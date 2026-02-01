import { useRoute, useLocation } from "wouter";
import { useJob, useRunJob } from "@/hooks/use-jobs";
import { StatusBadge, PriorityBadge } from "@/components/JobStatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ArrowLeft, Play, Loader2, Calendar, Clock, Database, Tag } from "lucide-react";
import { format } from "date-fns";

export default function JobDetail() {
  const [, params] = useRoute("/jobs/:id");
  const [, setLocation] = useLocation();
  const id = params ? parseInt(params.id) : 0;
  
  const { data: job, isLoading, error } = useJob(id);
  const runJobMutation = useRunJob();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-2">Job Not Found</h2>
        <Button variant="link" onClick={() => setLocation("/")}>Return to Dashboard</Button>
      </div>
    );
  }

  const handleRun = () => {
    runJobMutation.mutate(id);
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in space-y-6">
      <Button 
        variant="ghost" 
        className="hover:bg-transparent hover:text-primary p-0"
        onClick={() => setLocation("/")}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Dashboard
      </Button>

      {/* Header Card */}
      <div className="bg-white rounded-2xl border shadow-sm p-6 md:p-8 flex flex-col md:flex-row justify-between gap-6 items-start md:items-center">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span className="font-mono text-sm text-muted-foreground bg-muted px-2 py-0.5 rounded">
              #{job.id}
            </span>
            <PriorityBadge priority={job.priority} />
            <StatusBadge status={job.status} />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">{job.taskName}</h1>
          <p className="text-muted-foreground flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4" />
            Created on {format(new Date(job.createdAt), "MMMM do, yyyy 'at' h:mm a")}
          </p>
        </div>

        {job.status === "pending" && (
          <Button 
            size="lg"
            onClick={handleRun}
            disabled={runJobMutation.isPending}
            className="w-full md:w-auto shadow-lg shadow-primary/20"
          >
            {runJobMutation.isPending ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <Play className="mr-2 h-5 w-5" />
            )}
            Run Job Now
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Info Cards */}
        <Card className="md:col-span-1 border-border/60">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Timeline
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="relative border-l-2 border-muted pl-4 ml-1 space-y-8">
              <div className="relative">
                <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-primary ring-4 ring-white" />
                <p className="text-sm font-medium">Created</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {format(new Date(job.createdAt), "MMM d, HH:mm:ss")}
                </p>
              </div>

              {job.updatedAt && job.updatedAt !== job.createdAt && (
                <div className="relative">
                  <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-blue-400 ring-4 ring-white" />
                  <p className="text-sm font-medium">Last Updated</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {format(new Date(job.updatedAt), "MMM d, HH:mm:ss")}
                  </p>
                </div>
              )}

              {job.completedAt ? (
                <div className="relative">
                  <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-emerald-500 ring-4 ring-white" />
                  <p className="text-sm font-medium">Completed</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {format(new Date(job.completedAt), "MMM d, HH:mm:ss")}
                  </p>
                </div>
              ) : job.status === "failed" ? (
                <div className="relative">
                  <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-red-500 ring-4 ring-white" />
                  <p className="text-sm font-medium text-red-600">Failed</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Processing failed</p>
                </div>
              ) : (
                <div className="relative">
                  <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-slate-200 ring-4 ring-white" />
                  <p className="text-sm text-muted-foreground italic">Waiting to complete...</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Payload Display */}
        <Card className="md:col-span-2 border-border/60">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              Job Payload
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-950 rounded-xl p-4 overflow-hidden">
              <div className="flex items-center gap-1.5 mb-3 border-b border-slate-800 pb-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/20"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/20"></div>
                <span className="ml-2 text-xs text-slate-500 font-mono">payload.json</span>
              </div>
              <pre className="text-xs md:text-sm font-mono text-slate-300 overflow-x-auto">
                {JSON.stringify(job.payload, null, 2)}
              </pre>
            </div>
            
            {job.status !== "completed" && job.status !== "failed" && (
              <p className="text-xs text-muted-foreground mt-4 flex items-center gap-1">
                <Tag className="h-3 w-3" />
                This payload will be processed by the webhook worker.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
