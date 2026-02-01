import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type InsertJob } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useJobs(filters?: { status?: string; priority?: string }) {
  const queryKey = [api.jobs.list.path, filters?.status, filters?.priority];
  
  return useQuery({
    queryKey,
    queryFn: async () => {
      // Build query params
      const params = new URLSearchParams();
      if (filters?.status && filters.status !== "all") params.append("status", filters.status);
      if (filters?.priority && filters.priority !== "all") params.append("priority", filters.priority);
      
      const url = `${api.jobs.list.path}?${params.toString()}`;
      const res = await fetch(url, { credentials: "include" });
      
      if (!res.ok) throw new Error("Failed to fetch jobs");
      return api.jobs.list.responses[200].parse(await res.json());
    },
  });
}

export function useJob(id: number) {
  return useQuery({
    queryKey: [api.jobs.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.jobs.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch job");
      
      return api.jobs.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

export function useCreateJob() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertJob) => {
      const validated = api.jobs.create.input.parse(data);
      const res = await fetch(api.jobs.create.path, {
        method: api.jobs.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to create job");
      }
      return api.jobs.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.jobs.list.path] });
      toast({
        title: "Job Created",
        description: "New job has been successfully scheduled.",
      });
    },
    onError: (error) => {
      toast({
        title: "Creation Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useRunJob() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.jobs.run.path, { id });
      const res = await fetch(url, {
        method: api.jobs.run.method,
        credentials: "include",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to run job");
      }
      return api.jobs.run.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.jobs.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.jobs.get.path] }); // Invalidate specific job too
      toast({
        title: "Job Started",
        description: "The job is now running in the background.",
      });
    },
    onError: (error) => {
      toast({
        title: "Action Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
