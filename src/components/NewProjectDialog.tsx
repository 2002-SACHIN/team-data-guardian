import React from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { toast } from '@/components/ui/use-toast';
import { Plus } from 'lucide-react';
import { useAuthStore, Team } from '@/utils/auth';
import { addNewProject } from '@/utils/data';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

interface NewProjectDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onProjectAdded: () => void;
}

const NewProjectDialog: React.FC<NewProjectDialogProps> = ({ 
  isOpen, 
  onOpenChange, 
  onProjectAdded 
}) => {
  const { currentTeam } = useAuthStore();
  
  const form = useForm<{
    title: string;
    content: string;
  }>({
    defaultValues: {
      title: '',
      content: '',
    },
  });

  const onSubmit = (data: { title: string; content: string }) => {
    if (!currentTeam) {
      toast({
        title: "Error",
        description: "You need to be logged in to create a project",
        variant: "destructive",
      });
      return;
    }

    addNewProject(data.title, data.content, currentTeam as Team);
    
    toast({
      title: "Project Created",
      description: `Your project "${data.title}" has been added to Team ${currentTeam}`,
    });
    
    form.reset();
    onOpenChange(false);
    onProjectAdded();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Add a new project for Team {currentTeam}. Fill out the details below.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter project title..." {...field} />
                  </FormControl>
                  <FormDescription>
                    Give your project a descriptive name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your project..." 
                      className="min-h-[120px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Provide detailed information about your project.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="submit">Create Project</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default NewProjectDialog;
