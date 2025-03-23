
import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Calendar, Users } from 'lucide-react';
import { DataItem } from '@/utils/data';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription,
  SheetClose
} from '@/components/ui/sheet';

interface ProjectDetailsProps {
  project: DataItem | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ project, isOpen, onClose }) => {
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

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-lg md:max-w-xl overflow-y-auto">
        <SheetHeader className="mb-6">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-2xl">{project.title}</SheetTitle>
            {/* Removed the duplicate close button here */}
          </div>
        </SheetHeader>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
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
          
          <div className="text-base text-muted-foreground">
            {project.content.split('\n').map((paragraph, i) => (
              <p key={i} className="mb-4">{paragraph}</p>
            ))}
          </div>
        </motion.div>
      </SheetContent>
    </Sheet>
  );
};

export default ProjectDetails;
