import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, RefreshCw, Plus } from 'lucide-react';
import { useAuthStore } from '@/utils/auth';
import { getDataForTeam, DataItem, sampleData } from '@/utils/data';
import Header from '@/components/Header';
import DataCard from '@/components/DataCard';
import NewProjectDialog from '@/components/NewProjectDialog';
import ProjectDetails from '@/components/ProjectDetails';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { toast } from '@/components/ui/use-toast';

const Dashboard = () => {
  const { isAuthenticated, currentTeam } = useAuthStore();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [accessibleData, setAccessibleData] = useState<DataItem[]>([]);
  const [allData, setAllData] = useState<DataItem[]>([]);
  const [filteredData, setFilteredData] = useState<DataItem[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedProject, setSelectedProject] = useState<DataItem | null>(null);
  const [projectDetailsOpen, setProjectDetailsOpen] = useState(false);
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (currentTeam) {
      loadData();
    }
  }, [currentTeam]);

  const loadData = () => {
    if (currentTeam) {
      const teamData = getDataForTeam(currentTeam);
      const allProjectsData = getDataForTeam('A');
      setAccessibleData(teamData);
      setAllData(allProjectsData);
      setFilteredData(activeTab === 'all' ? allProjectsData : teamData);
    }
  };

  useEffect(() => {
    const query = searchQuery.toLowerCase();
    let dataToFilter = activeTab === 'all' ? allData : accessibleData;
    
    const filtered = dataToFilter.filter(item => 
      item.title.toLowerCase().includes(query) || 
      item.content.toLowerCase().includes(query)
    );
    
    setFilteredData(filtered);
  }, [searchQuery, activeTab, accessibleData, allData]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    const dataToFilter = value === 'all' ? allData : accessibleData;
    const query = searchQuery.toLowerCase();
    
    const filtered = dataToFilter.filter(item => 
      item.title.toLowerCase().includes(query) || 
      item.content.toLowerCase().includes(query)
    );
    
    setFilteredData(filtered);
  };

  const handleProjectClick = (project: DataItem) => {
    setSelectedProject(project);
    setProjectDetailsOpen(true);
  };

  const handleProjectAdded = () => {
    loadData();
    toast({
      title: "Project Added",
      description: "Your new project has been added successfully.",
    });
  };

  const handleProjectDeleted = () => {
    setSelectedProject(null);
    setProjectDetailsOpen(false);
    
    loadData();
    
    toast({
      title: "Project Deleted",
      description: "The project has been deleted successfully.",
    });
  };

  const handleProjectEdited = () => {
    loadData();
    
    if (selectedProject) {
      const updatedProjectData = getDataForTeam('A').find(p => p.id === selectedProject.id);
      if (updatedProjectData) {
        setSelectedProject(updatedProjectData);
      }
    }
    
    toast({
      title: "Project Updated",
      description: "The project has been updated successfully.",
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.05
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-accent/30 to-background page-transition">
      <Header />
      
      <main className="pt-24 pb-16 px-4 max-w-7xl mx-auto">
        <div className="mb-8">
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold mb-2"
          >
            {currentTeam === 'A' ? 'All Team Data' : `Team ${currentTeam} Dashboard`}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.1 } }}
            className="text-muted-foreground"
          >
            {currentTeam === 'A' 
              ? 'As an admin, you have access to view all team data'
              : `View data accessible to Team ${currentTeam}`}
          </motion.p>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col md:flex-row justify-between gap-4 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4 flex-1">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search data..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="w-full md:w-auto">
              <ToggleGroup type="single" value={activeTab} onValueChange={(value) => value && handleTabChange(value)} className="justify-start">
                <ToggleGroupItem value="all" aria-label="Show all data">All Data</ToggleGroupItem>
                <ToggleGroupItem value="accessible" aria-label="Show only accessible data">Accessible Only</ToggleGroupItem>
              </ToggleGroup>
            </div>
            
            <Button variant="outline" size="icon" className="md:ml-2" onClick={() => {setSearchQuery(''); loadData();}}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
          
          <Button className="gap-2" onClick={() => setShowNewProjectDialog(true)}>
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </motion.div>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab + searchQuery}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <DataCard 
                  key={item.id} 
                  data={item} 
                  index={index} 
                  onClick={handleProjectClick}
                />
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-3 py-16 text-center text-muted-foreground"
              >
                No data found matching your search criteria
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
      
      {selectedProject && (
        <ProjectDetails 
          project={selectedProject} 
          isOpen={projectDetailsOpen} 
          onClose={() => {
            setProjectDetailsOpen(false);
            setTimeout(() => {
              setSelectedProject(null);
            }, 300);
          }} 
          onDelete={handleProjectDeleted}
          onEdit={handleProjectEdited}
        />
      )}
      
      <NewProjectDialog 
        isOpen={showNewProjectDialog}
        onOpenChange={setShowNewProjectDialog}
        onProjectAdded={handleProjectAdded} 
      />
    </div>
  );
};

export default Dashboard;
