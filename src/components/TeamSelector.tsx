import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Users, Database, ShieldCheck, Shield } from 'lucide-react';
import { useAuthStore, Team } from '@/utils/auth';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const TeamSelector = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const teamOptions: { id: Team; name: string; icon: React.ReactNode; color: string; description: string }[] = [
    {
      id: 'X',
      name: 'Team X',
      icon: <Users className="w-6 h-6" />,
      color: 'border-teamX/20 bg-teamX/5 hover:bg-teamX/10',
      description: 'Research & Development'
    },
    {
      id: 'Y',
      name: 'Team Y',
      icon: <Database className="w-6 h-6" />,
      color: 'border-teamY/20 bg-teamY/5 hover:bg-teamY/10',
      description: 'Marketing & Sales'
    },
    {
      id: 'Z',
      name: 'Team Z',
      icon: <ShieldCheck className="w-6 h-6" />,
      color: 'border-teamZ/20 bg-teamZ/5 hover:bg-teamZ/10',
      description: 'Engineering & Product'
    },
    {
      id: 'A',
      name: 'Team A',
      icon: <Shield className="w-6 h-6" />,
      color: 'border-teamA/20 bg-teamA/5 hover:bg-teamA/10',
      description: 'Administration & Oversight'
    }
  ];

  const handleTeamSelect = (team: Team) => {
    login(team);
    toast({
      title: `Logged in as Team ${team}`,
      description: team === 'A' ? 'You have access to all data' : `You have access to Team ${team} data only`,
    });
    navigate('/dashboard');
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="w-full max-w-3xl">
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {teamOptions.map((team) => (
          <motion.div key={team.id} variants={item}>
            <Button
              variant="outline"
              className={`w-full p-6 h-auto flex flex-col items-center justify-center text-left space-y-3 rounded-xl border ${team.color} transition-all duration-300`}
              onClick={() => handleTeamSelect(team.id)}
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-background">
                {team.icon}
              </div>
              <div className="text-center">
                <h3 className="text-lg font-medium">{team.name}</h3>
                <p className="text-sm text-muted-foreground">{team.description}</p>
              </div>
            </Button>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default TeamSelector;
