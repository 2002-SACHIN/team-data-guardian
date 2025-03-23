
import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Lock } from 'lucide-react';
import { format } from 'date-fns';
import { DataItem } from '@/utils/data';
import { useAuthStore, hasAccessToData } from '@/utils/auth';

interface DataCardProps {
  data: DataItem;
  index: number;
}

const DataCard: React.FC<DataCardProps> = ({ data, index }) => {
  const { currentTeam } = useAuthStore();
  const hasAccess = hasAccessToData(data.team, currentTeam);
  
  // Format the date
  const formattedDate = format(new Date(data.createdAt), 'MMM d, yyyy');
  
  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.4,
        ease: [0.25, 0.1, 0.25, 1.0],
      }
    }),
  };
  
  const getTeamBadgeClass = () => {
    switch (data.team) {
      case 'X': return 'team-badge-x';
      case 'Y': return 'team-badge-y';
      case 'Z': return 'team-badge-z';
      case 'A': return 'team-badge-a';
      default: return '';
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      custom={index}
      className={`card-glass rounded-xl p-6 transition-all duration-300 ${hasAccess ? 'hover:shadow-md' : 'opacity-80'}`}
    >
      <div className="flex justify-between items-start mb-3">
        <div className={`px-2.5 py-1 text-xs font-medium rounded-full ${getTeamBadgeClass()}`}>
          Team {data.team}
        </div>
        
        <div className="flex items-center text-xs text-muted-foreground">
          <Calendar className="w-3.5 h-3.5 mr-1.5" />
          {formattedDate}
        </div>
      </div>
      
      <h3 className="text-lg font-medium mb-2">{hasAccess ? data.title : "Restricted Content"}</h3>
      
      {hasAccess ? (
        <p className="text-muted-foreground">{data.content}</p>
      ) : (
        <div className="flex flex-col items-center py-8 text-muted-foreground">
          <Lock className="w-8 h-8 mb-3 opacity-40" />
          <p className="text-center">
            You don't have permission to view this content.
            <br />
            <span className="text-sm opacity-70">This belongs to Team {data.team}</span>
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default DataCard;
