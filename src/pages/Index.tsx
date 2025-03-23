
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { useAuthStore } from '@/utils/auth';
import TeamSelector from '@/components/TeamSelector';

const Index = () => {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gradient-to-b from-accent/30 to-background">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex justify-center mb-6"
        >
          <Shield className="w-16 h-16 text-primary" />
        </motion.div>
        <h1 className="text-4xl font-bold mb-3">Team Data Guardian</h1>
        <p className="text-xl text-muted-foreground max-w-md mx-auto">
          Secure access to team information based on your credentials
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="w-full max-w-3xl"
      >
        <div className="card-glass rounded-xl p-8">
          <h2 className="text-xl font-medium mb-6 text-center">Select Your Team</h2>
          <TeamSelector />
        </div>
      </motion.div>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="mt-12 text-sm text-muted-foreground"
      >
        Team A has access to all data • Teams X, Y, Z can only access their own data
      </motion.p>
    </div>
  );
};

export default Index;
