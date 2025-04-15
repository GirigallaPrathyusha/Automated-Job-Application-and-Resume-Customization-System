import React, { createContext, useContext, useState, useEffect } from 'react';
import { Resume, Job, Application } from '@/types';
import { useAuth } from './AuthContext';

interface ResumeContextType {
  resume: Resume | null;
  isUploading: boolean;
  uploadResume: (file: File) => Promise<void>;
  recommendedJobs: Job[];
  applications: Application[];
  applyForJob: (jobId: string) => Promise<void>;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export const ResumeProvider = ({ children }: { children: React.ReactNode }) => {
  const [resume, setResume] = useState<Resume | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [recommendedJobs, setRecommendedJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const { user, updateUser } = useAuth();

  // Load data from localStorage on initial render
  useEffect(() => {
    if (user?.resume) {
      setResume(user.resume);
      
      // Get job recommendations based on resume
      getMockJobRecommendations(user.resume);
      
      // Add sample applications data
      const sampleApplications: Application[] = [
        {
          id: '1',
          jobId: '1',
          userId: user.id,
          status: 'Submitted Successfully',
          submissionDate: '2025-04-10T10:00:00Z',
          resume: user.resume,
          job: {
            title: 'Senior Frontend Developer',
            company: 'Google'
          }
        },
        {
          id: '2',
          jobId: '2',
          userId: user.id,
          status: 'Processing',
          submissionDate: '2025-04-12T15:30:00Z',
          resume: user.resume,
          job: {
            title: 'Full Stack Engineer',
            company: 'Microsoft'
          }
        },
        {
          id: '3',
          jobId: '3',
          userId: user.id,
          status: 'Submission Failed',
          submissionDate: '2025-04-13T09:15:00Z',
          resume: user.resume,
          job: {
            title: 'React Developer',
            company: 'Meta'
          }
        },
        {
          id: '4',
          jobId: '4',
          userId: user.id,
          status: 'Shortlisted',
          submissionDate: '2025-04-14T11:45:00Z',
          resume: user.resume,
          job: {
            title: 'UI/UX Developer',
            company: 'Apple'
          }
        }
      ];
      
      setApplications(sampleApplications);
    }
  }, [user]);

  const getMockJobRecommendations = (resume: Resume) => {
    // In a real app, this would be based on resume analysis
    // For demo, we'll return mock data
    const mockJobs: Job[] = [
      {
        id: '1',
        title: 'Software Engineer',
        company: 'Google',
        location: 'Mountain View, CA',
        description: 'Exciting opportunity to work on cutting-edge technology...',
        requirements: ['5+ years of experience', 'JavaScript expertise', 'React knowledge'],
        skills: ['JavaScript', 'React', 'TypeScript'],
        postedDate: '2025-04-01',
        salary: '$150,000 - $180,000'
      },
      {
        id: '2',
        title: 'Data Analyst',
        company: 'Amazon',
        location: 'Seattle, WA',
        description: 'Join our data science team to analyze large datasets...',
        requirements: ['3+ years of experience', 'SQL proficiency', 'Data visualization'],
        skills: ['SQL', 'Python', 'Tableau'],
        postedDate: '2025-04-05',
        salary: '$120,000 - $150,000'
      },
      {
        id: '3',
        title: 'Web Developer',
        company: 'Microsoft',
        location: 'Redmond, WA',
        description: 'Create user-friendly web applications...',
        requirements: ['2+ years of experience', 'Frontend skills', 'Backend knowledge'],
        skills: ['JavaScript', 'HTML', 'CSS', 'Node.js'],
        postedDate: '2025-04-10',
        salary: '$130,000 - $160,000'
      }
    ];
    
    setRecommendedJobs(mockJobs);
  };

  const uploadResume = async (file: File) => {
    setIsUploading(true);
    
    try {
      // In a real app, you'd upload the file to a server
      // For demo, we'll simulate by creating a data URL
      const reader = new FileReader();
      
      const filePromise = new Promise<string>((resolve) => {
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
      
      const fileUrl = await filePromise;
      
      const fileType = file.name.endsWith('.pdf') ? 'pdf' : 'docx';
      
      const newResume: Resume = {
        id: Math.random().toString(36).substring(2, 9),
        fileName: file.name,
        fileUrl,
        fileType,
        uploadDate: new Date().toISOString()
      };
      
      setResume(newResume);
      
      // Update user with resume
      updateUser({ resume: newResume });
      
      // Get job recommendations
      getMockJobRecommendations(newResume);
    } catch (error) {
      console.error('Resume upload failed:', error);
      throw new Error('Failed to upload resume');
    } finally {
      setIsUploading(false);
    }
  };

  const applyForJob = async (jobId: string) => {
    if (!resume) {
      throw new Error('Please upload a resume before applying');
    }
    
    // Find the job from recommended jobs
    const job = recommendedJobs.find(job => job.id === jobId);
    
    if (!job) {
      throw new Error('Job not found');
    }
    
    // Create a new application
    const newApplication: Application = {
      id: Math.random().toString(36).substring(2, 9),
      jobId,
      userId: user?.id || '',
      status: Math.random() > 0.8 ? 'Submission Failed' : 'Submitted Successfully',
      submissionDate: new Date().toISOString(),
      resume,
      job: {
        title: job.title,
        company: job.company
      }
    };
    
    // Add to applications
    const updatedApplications = [...applications, newApplication];
    setApplications(updatedApplications);
    
    // Store in localStorage
    if (user?.id) {
      localStorage.setItem(`jobApp_applications_${user.id}`, JSON.stringify(updatedApplications));
    }
    
    // In a real app, you'd make an API call here
    return Promise.resolve();
  };

  return (
    <ResumeContext.Provider 
      value={{ 
        resume, 
        isUploading, 
        uploadResume, 
        recommendedJobs, 
        applications,
        applyForJob
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
};

export const useResume = () => {
  const context = useContext(ResumeContext);
  if (context === undefined) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
};
