
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Calendar, Users, Trash2, Edit, Save, X } from 'lucide-react';
import { DataItem, deleteProject, editProject } from '@/utils/data';
import { useAuthStore } from '@/utils/auth';
import { toast } from '@/components/ui/use-toast';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle,
  SheetClose
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface ProjectDetailsProps {
  project: DataItem | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ 
  project, 
  isOpen, 
  onClose,
  onDelete,
  onEdit
}) => {
  const { currentTeam } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedContent, setEditedContent] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  if (!project) return null;
  
  const formattedDate = format(new Date(project.createdAt), 'MMMM d, yyyy');
  
  const getTeamColorClass = () => {
    switch (project.team) {
      case 'X': return 'text-teamX';
      case 'Y': return 'text-teamY';
      case 'Z': return 'text-teamZ';
      case 'A': return 'text-teamA';
      default: return '';
    }
  };

  const canModify = currentTeam === 'A' || project.team === currentTeam;

  const handleEdit = () => {
    setEditedTitle(project.title);
    setEditedContent(project.content);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!currentTeam) return;
    
    if (editProject(project.id, { 
      title: editedTitle, 
      content: editedContent 
    }, currentTeam)) {
      setIsEditing(false);
      if (onEdit) onEdit();
    } else {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to edit this project.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = () => {
    if (!currentTeam) return;
    
    if (deleteProject(project.id, currentTeam)) {
      setShowDeleteConfirm(false);
      if (onDelete) onDelete();
    } else {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to delete this project.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <SheetContent className="w-full sm:max-w-lg md:max-w-xl overflow-y-auto">
          <SheetHeader className="mb-6">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-2xl">
                {!isEditing ? project.title : (
                  <Input 
                    value={editedTitle} 
                    onChange={(e) => setEditedTitle(e.target.value)}
                    className="text-2xl font-semibold h-auto py-1"
                  />
                )}
              </SheetTitle>
            </div>
          </SheetHeader>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex flex-wrap justify-between items-center gap-3">
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center text-sm text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
                  <Calendar className="w-3.5 h-3.5 mr-1.5" />
                  {formattedDate}
                </div>
                
                <div className={`flex items-center text-sm ${getTeamColorClass()} bg-muted/50 px-3 py-1 rounded-full`}>
                  <Users className="w-3.5 h-3.5 mr-1.5" />
                  Team {project.team}
                </div>
              </div>
              
              {canModify && (
                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                        <X className="w-4 h-4 mr-1" />
                        Cancel
                      </Button>
                      <Button size="sm" onClick={handleSave}>
                        <Save className="w-4 h-4 mr-1" />
                        Save
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button size="sm" variant="outline" onClick={handleEdit}>
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => setShowDeleteConfirm(true)}>
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </>
                  )}
                </div>
              )}
            </div>
            
            <div className="text-base text-muted-foreground">
              {!isEditing ? (
                project.content.split('\n').map((paragraph, i) => (
                  <p key={i} className="mb-4">{paragraph}</p>
                ))
              ) : (
                <Textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="min-h-[200px]"
                />
              )}
            </div>
          </motion.div>
        </SheetContent>
      </Sheet>
      
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the project "{project.title}".
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ProjectDetails;
