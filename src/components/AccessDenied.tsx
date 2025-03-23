
import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert } from 'lucide-react';

interface AccessDeniedProps {
  team: string;
}

const AccessDenied: React.FC<AccessDeniedProps> = ({ team }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center p-8 card-glass rounded-xl"
    >
      <motion.div
        initial={{ y: 10 }}
        animate={{ y: [0, -5, 0] }}
        transition={{ repeat: Infinity, duration: 2, repeatType: "reverse" }}
      >
        <ShieldAlert className="w-16 h-16 text-muted-foreground opacity-40 mb-4" />
      </motion.div>
      
      <h2 className="text-xl font-medium mb-2">Access Denied</h2>
      <p className="text-center text-muted-foreground max-w-md">
        This content belongs to Team {team} and you don't have permission to view it.
        <br />
        Please contact an administrator if you believe this is an error.
      </p>
    </motion.div>
  );
};

export default AccessDenied;
