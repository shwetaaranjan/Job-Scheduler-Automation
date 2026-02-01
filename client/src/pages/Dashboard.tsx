import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useJobs, useRunJob } from "@/hooks/use-jobs";
import { StatusBadge, PriorityBadge } from "@/components/JobStatusBadge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Loader2, Play, Plus, Search, Terminal } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

export default function Dashboard() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const { data: jobs, isLoading } = useJobs({ status: statusFilter, priority: priorityFilter });
  const runJobMutation = useRunJob();
  const [, setLocation] = useLocation();

  const handleRunJob = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    runJobMutation.mutate(id);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Job Overview</h1>
          <p className="text-muted-foreground mt-1">Manage and monitor your background tasks.</p>
        </div>
        <Link href="/create">
          <Button className="gap-2 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all">
            <Plus className="h-4 w-4" />
            Schedule New Job
          </Button>
        </Link>
      </div>

      {/* Filters Section */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl border shadow-sm">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground min-w-fit">
          <Search className="h-4 w-4" />
          Filter by:
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="running">Running</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>

        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="High">High</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="Low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Jobs List */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading jobs...</p>
        </div>
      ) : jobs?.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-96 bg-white rounded-2xl border border-dashed border-border/60">
          <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <Terminal className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold">No jobs found</h3>
          <p className="text-muted-foreground mt-2 mb-6">Create a new job to get started or adjust your filters.</p>
          <Link href="/create">
            <Button variant="outline">Create Job</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {jobs?.map((job) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={job.id}
              onClick={() => setLocation(`/jobs/${job.id}`)}
              className="group relative bg-white rounded-xl border p-5 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 cursor-pointer"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                      #{job.id}
                    </span>
                    <PriorityBadge priority={job.priority} />
                    <StatusBadge status={job.status} />
                  </div>
                  <h3 className="text-lg font-semibold truncate group-hover:text-primary transition-colors">
                    {job.taskName}
                  </h3>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <span>Created: {format(new Date(job.createdAt), "MMM d, yyyy HH:mm")}</span>
                    {job.completedAt && (
                      <span>• Completed: {format(new Date(job.completedAt), "MMM d, HH:mm")}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {job.status === "pending" && (
                    <Button
                      size="sm"
                      className="bg-primary/10 text-primary hover:bg-primary hover:text-white border-0"
                      onClick={(e) => handleRunJob(e, job.id)}
                      disabled={runJobMutation.isPending}
                    >
                      {runJobMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Play className="h-4 w-4 mr-2" />
                      )}
                      Run Job
                    </Button>
                  )}
                  <div className="text-muted-foreground group-hover:text-primary transition-colors">
                    <span className="sr-only">View Details</span>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
