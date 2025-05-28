import React, { createContext, useContext, useState, useEffect } from 'react';
import { Resume } from '@/types';
import { useAuth } from './AuthContext';
import { supabase } from '@/lib/supabase';

type Application = any; // Temporary solution
interface ResumeContextType {
  resume: Resume | null;
  isUploading: boolean;
  uploadResume: (file: File) => Promise<void>;
  applications: Application[]; 
  recommendedJobs: {
    id: string;
    title: string;
    company: string;
    location: string;
    salary: string;
    postedDate: string;
    skills: string[];
  }[];
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export function ResumeProvider({ children }: { children: React.ReactNode }) {
  const [resume, setResume] = useState<Resume | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [applications, setApplications] = useState<Application[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchUserResume = async () => {
      if (!user?.id) return;
      
      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('user_id', user.id)
        .order('upload_date', { ascending: false })
        .limit(1)
        .single();

      if (!error && data) {
        setResume({
          id: data.id,
          fileName: data.file_name,
          fileUrl: data.file_path,
          fileType: data.file_type,
          uploadDate: data.upload_date
        });
      }
    };

    fetchUserResume();
  }, [user]);

  /*const uploadResume = async (file: File) => {
    if (!user?.id) throw new Error('User not logged in');
    
    setIsUploading(true);
    
    try {
      // Delete existing resume file if it exists
      if (resume?.fileUrl) {
        const existingFilePath = resume.fileUrl.split('/').pop();
        if (existingFilePath) {
          await supabase.storage
            .from('resumes')
            .remove([`user-${user.id}/${existingFilePath}`]);
        }
      }
  
      const fileExt = file.name.split('.').pop()?.toLowerCase() || '';
      // Sanitize filename and create path
      const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const filePath = `user-${user.id}/${Date.now()}_${sanitizedFileName}`;
  
      // 1. Upload to storage bucket with better error handling
      const { error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false, // Don't overwrite - create new version
          contentType: file.type || 
            (fileExt === 'pdf' ? 'application/pdf' : 
             fileExt === 'docx' ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' : 
             'application/octet-stream')
        });
  
      if (uploadError) {
        if (uploadError.message.includes('already exists')) {
          throw new Error('A file with this name already exists');
        }
        throw uploadError;
      }
  
      // 2. Get public URL (consider if you want public or signed URL)
      const { data: { publicUrl } } = supabase.storage
        .from('resumes')
        .getPublicUrl(filePath);
  
      // 3. Store metadata with additional useful fields
      const { data, error } = await supabase
        .from('resumes')
        .insert([{
          user_id: user.id,
          file_name: file.name,
          file_path: filePath,
          file_url: publicUrl,
          file_type: fileExt,
          file_size: file.size,
          storage_bucket: 'resumes',
          is_public: true // or false if using signed URLs
        }])
        .select()
        .single();
  
      if (error) throw error;
  
      // Update state
      setResume({
        id: data.id,
        fileName: data.file_name,
        fileUrl: data.file_url,
        fileType: data.file_type,
        uploadDate: data.upload_date
      });
  
    } catch (error) {
      console.error('Resume upload failed:', error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };*/

  const uploadResume = async (file: File) => {
    if (!user?.id) throw new Error('User not logged in');
    
    setIsUploading(true);
    
    try {
      // First get the existing resume to delete both file and record
      const { data: existingResumes } = await supabase
        .from('resumes')
        .select('*')
        .eq('user_id', user.id);
  
      // Delete all existing resume files and records
      if (existingResumes && existingResumes.length > 0) {
        const filesToDelete = existingResumes
          .map(resume => resume.file_path)
          .filter(Boolean);
        
        if (filesToDelete.length > 0) {
          await supabase.storage
            .from('resumes')
            .remove(filesToDelete);
        }
  
        // Delete all existing records
        await supabase
          .from('resumes')
          .delete()
          .eq('user_id', user.id);
      }
  
      const fileExt = file.name.split('.').pop()?.toLowerCase() || '';
      const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const filePath = `user-${user.id}/${Date.now()}_${sanitizedFileName}`;
  
      // Upload new file
      const { error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type || 
            (fileExt === 'pdf' ? 'application/pdf' : 
             fileExt === 'docx' ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' : 
             'application/octet-stream')
        });
  
      if (uploadError) throw uploadError;
  
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('resumes')
        .getPublicUrl(filePath);
  
      // Create new record
      const { data, error } = await supabase
        .from('resumes')
        .insert([{
          user_id: user.id,
          file_name: file.name,
          file_path: filePath,
          file_url: publicUrl,
          file_type: fileExt,
          file_size: file.size,
          storage_bucket: 'resumes',
          is_public: true
        }])
        .select()
        .single();
  
      if (error) throw error;
  
      setResume({
        id: data.id,
        fileName: data.file_name,
        fileUrl: data.file_url,
        fileType: data.file_type,
        uploadDate: data.upload_date
      });
  
    } catch (error) {
      console.error('Resume upload failed:', error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  
  const [recommendedJobs, setRecommendedJobs] = useState<ResumeContextType['recommendedJobs']>([]);

  return (
    <ResumeContext.Provider value={{
      resume,
      isUploading,
      uploadResume,
      applications,
      recommendedJobs,
    }}>
      {children}
    </ResumeContext.Provider>
  );
}

export const useResume = () => {
  const context = useContext(ResumeContext);
  if (context === undefined) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
};




