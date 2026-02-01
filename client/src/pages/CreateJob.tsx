import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateJob } from "@/hooks/use-jobs";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { insertJobSchema } from "@shared/schema";

// Frontend validation schema - ensuring payload is valid JSON string for UX
const formSchema = insertJobSchema.extend({
  payload: z.string().refine((val) => {
    try {
      JSON.parse(val);
      return true;
    } catch {
      return false;
    }
  }, "Must be valid JSON"),
});

type FormValues = z.infer<typeof formSchema>;

export default function CreateJob() {
  const [, setLocation] = useLocation();
  const createJob = useCreateJob();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      taskName: "",
      priority: "Medium",
      payload: "{\n  \"key\": \"value\"\n}",
    },
  });

  const onSubmit = (data: FormValues) => {
    // Parse the JSON string back to an object for the API
    const apiData = {
      ...data,
      payload: JSON.parse(data.payload as unknown as string),
    };
    
    createJob.mutate(apiData, {
      onSuccess: () => setLocation("/"),
    });
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <Button 
        variant="ghost" 
        className="mb-6 hover:bg-transparent hover:text-primary p-0"
        onClick={() => setLocation("/")}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Dashboard
      </Button>

      <div className="grid gap-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight">Create New Job</h1>
          <p className="text-muted-foreground">Configure a new background task to be processed.</p>
        </div>

        <Card className="border-border shadow-lg shadow-black/5 overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-primary to-accent" />
          <CardContent className="p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="taskName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold">Task Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g. Data Sync Daily" 
                          {...field} 
                          className="h-12 px-4 rounded-xl text-base"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold">Priority Level</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12 px-4 rounded-xl text-base">
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Low">Low - Process when idle</SelectItem>
                          <SelectItem value="Medium">Medium - Standard processing</SelectItem>
                          <SelectItem value="High">High - Immediate processing</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="payload"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold flex justify-between items-center">
                        <span>Payload Data (JSON)</span>
                        <span className="text-xs font-normal text-muted-foreground font-mono">
                          Must be valid JSON object
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          className="font-mono text-sm min-h-[200px] rounded-xl bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="pt-4 flex justify-end gap-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setLocation("/")}
                    className="rounded-xl h-11 px-8"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="rounded-xl h-11 px-8 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
                    disabled={createJob.isPending}
                  >
                    {createJob.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Create Job
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
