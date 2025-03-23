
export interface DataItem {
  id: string;
  title: string;
  content: string;
  team: 'X' | 'Y' | 'Z' | 'A';
  createdAt: string;
}

// Sample data for demonstration
export const sampleData: DataItem[] = [
  {
    id: '1',
    title: 'Team X Project Plan',
    content: 'This document outlines the strategic roadmap for Team X in the upcoming quarter, including key milestones, resource allocation, and success metrics.',
    team: 'X',
    createdAt: '2023-10-15T08:30:00Z',
  },
  {
    id: '2',
    title: 'Team X Budget Analysis',
    content: 'Financial breakdown of Team X expenses and revenue projections for the current fiscal year with comparison to previous performance.',
    team: 'X',
    createdAt: '2023-10-12T11:45:00Z',
  },
  {
    id: '3',
    title: 'Team Y Marketing Strategy',
    content: 'Comprehensive marketing plan for Team Y including target audience analysis, messaging framework, and channel optimization recommendations.',
    team: 'Y',
    createdAt: '2023-10-10T09:15:00Z',
  },
  {
    id: '4',
    title: 'Team Y Customer Feedback Summary',
    content: 'Analysis of recent customer satisfaction surveys with actionable insights for Team Y product improvements and service enhancements.',
    team: 'Y',
    createdAt: '2023-10-08T14:20:00Z',
  },
  {
    id: '5',
    title: 'Team Z Technology Stack Review',
    content: 'Technical assessment of current infrastructure with recommendations for Team Z platform optimization and scalability improvements.',
    team: 'Z',
    createdAt: '2023-10-06T10:30:00Z',
  },
  {
    id: '6',
    title: 'Team Z Innovation Pipeline',
    content: 'Overview of Team Z research initiatives and development projects in various stages, from ideation to prototype testing.',
    team: 'Z',
    createdAt: '2023-10-04T16:45:00Z',
  },
  {
    id: '7',
    title: 'Cross-Team Collaboration Framework',
    content: 'Guidelines for fostering effective collaboration across teams X, Y, and Z, with recommended tools and communication protocols.',
    team: 'A',
    createdAt: '2023-10-02T13:00:00Z',
  },
  {
    id: '8',
    title: 'Organization-Wide Security Protocols',
    content: 'Comprehensive security policies and practices to be implemented across all teams, addressing data protection, access control, and incident response.',
    team: 'A',
    createdAt: '2023-09-30T09:45:00Z',
  },
];

// Use localStorage to persist data across sessions
const loadPersistedData = (): DataItem[] => {
  const savedData = localStorage.getItem('teamProjectsData');
  if (savedData) {
    try {
      return JSON.parse(savedData);
    } catch (e) {
      console.error('Failed to parse saved data', e);
      return [...sampleData];
    }
  }
  return [...sampleData];
};

// Initialize with either persisted data or sample data
let projectsData = loadPersistedData();

// Save to localStorage
const persistData = () => {
  localStorage.setItem('teamProjectsData', JSON.stringify(projectsData));
};

export const getDataForTeam = (team: string | null) => {
  if (!team) return [];
  if (team === 'A') return projectsData; // Admin team can see all data
  return projectsData.filter(item => item.team === team);
};

export const getDataById = (id: string) => {
  return projectsData.find(item => item.id === id);
};

export const addNewProject = (title: string, content: string, team: 'X' | 'Y' | 'Z' | 'A'): DataItem => {
  const newProject: DataItem = {
    id: Date.now().toString(), // Simple unique ID
    title,
    content,
    team,
    createdAt: new Date().toISOString(),
  };
  
  projectsData = [newProject, ...projectsData];
  persistData();
  return newProject;
};
