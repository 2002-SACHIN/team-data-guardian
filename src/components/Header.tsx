import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, LogOut } from 'lucide-react';
import { useAuthStore } from '@/utils/auth';
import { Button } from '@/components/ui/button';

const Header = () => {
  const { currentTeam, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getTeamColor = () => {
    switch (currentTeam) {
      case 'X': return 'bg-teamX text-white';
      case 'Y': return 'bg-teamY text-white';
      case 'Z': return 'bg-teamZ text-white';
      case 'A': return 'bg-teamA text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 py-4 px-6 bg-white/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Shield className="w-6 h-6 text-primary" />
          <span className="text-xl font-semibold">Data Guardian</span>
        </div>
        
        {currentTeam && (
          <div className="flex items-center space-x-4">
            <div className={`px-3 py-1 rounded-full ${getTeamColor()} text-sm font-medium`}>
              Team {currentTeam}
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
