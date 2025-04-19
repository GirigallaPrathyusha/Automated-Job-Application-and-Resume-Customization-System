import React, { createContext, useContext, useState, useEffect } from 'react';
import { Resume } from '@/types';
import { useAuth } from './AuthContext';
import { supabase } from '@/lib/supabase';

interface ResumeContextType {
  resume: Resume | null;
  isUploading: boolean;
  uploadResume: (file: File) => Promise<void>;
  applications: Application[]; 
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export const ResumeProvider = ({ children }: { children: React.ReactNode }) => {
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

  const uploadResume = async (file: File) => {
    if (!user?.id) throw new Error('User not logged in');
    
    setIsUploading(true);
    
    try {
      const fileExt = file.name.split('.').pop()?.toLowerCase() || '';
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `resumes/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Insert metadata into resumes table
      const { data, error } = await supabase
        .from('resumes')
        .insert([{
          user_id: user.id,
          file_name: file.name,
          file_path: filePath,
          file_type: fileExt,
          file_size: file.size
        }])
        .select()
        .single();

      if (error) throw error;

      setResume({
        id: data.id,
        fileName: data.file_name,
        fileUrl: data.file_path,
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

  return (
    <ResumeContext.Provider value={{ resume, isUploading, uploadResume,applications  }}>
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