
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useResume } from '@/contexts/ResumeContext';
import { useToast } from '@/components/ui/use-toast';
import { FileUp, File, CheckCircle, AlertCircle } from 'lucide-react';

export default function UploadResumePage() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadResume, isUploading, resume } = useResume();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    const fileType = file.name.split('.').pop()?.toLowerCase();
    
    if (fileType !== 'pdf' && fileType !== 'docx') {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF or DOCX file",
        variant: "destructive",
      });
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 5MB",
        variant: "destructive",
      });
      return;
    }
    
    setFile(file);
  };

  const handleUpload = async () => {
    if (!file) return;
    
    try {
      await uploadResume(file);
      toast({
        title: "Resume uploaded",
        description: "Your resume has been uploaded successfully!",
      });
      navigate('/job-listings');
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload resume. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Upload Your Resume</h1>
        <p className="text-gray-500 mt-2">
          Upload your resume to get personalized job recommendations
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Resume Upload</CardTitle>
          <CardDescription>
            We accept PDF and DOCX files (max 5MB)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {resume ? (
            <div className="bg-green-50 border border-green-100 rounded-lg p-6 text-center">
              <CheckCircle className="h-12 w-12 text-success mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Resume Already Uploaded</h3>
              <p className="text-sm text-gray-500 mb-6">
                You have already uploaded your resume: <strong>{resume.fileName}</strong>
              </p>
              <div className="flex justify-center space-x-4">
                <Button 
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Replace Resume
                </Button>
                <Button
                  className="bg-appPurple hover:bg-appSecondary"
                  onClick={() => navigate('/job-listings')}
                >
                  View Job Recommendations
                </Button>
              </div>
            </div>
          ) : (
            <div
              className={`border-2 border-dashed rounded-lg p-12 text-center ${
                isDragging 
                  ? 'border-appPurple bg-appPurple-light' 
                  : 'border-gray-300 hover:border-appPurple'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <FileUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">
                {file ? file.name : 'Drag & Drop your resume here'}
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                {file 
                  ? `${(file.size / 1024 / 1024).toFixed(2)}MB - ${file.type}` 
                  : 'or click to browse files (PDF, DOCX)'}
              </p>
              
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf,.docx"
                className="hidden"
              />
              
              {file ? (
                <Button 
                  className="bg-appPurple hover:bg-appSecondary"
                  disabled={isUploading}
                  onClick={handleUpload}
                >
                  {isUploading ? "Uploading..." : "Upload Resume"}
                </Button>
              ) : (
                <Button
                  variant="outline" 
                  onClick={() => fileInputRef.current?.click()}
                >
                  Browse Files
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Why Upload Your Resume?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center text-center p-4">
              <div className="bg-appPurple-light p-3 rounded-full mb-4">
                <File className="h-6 w-6 text-appPurple" />
              </div>
              <h3 className="font-medium mb-2">One-Click Apply</h3>
              <p className="text-sm text-gray-500">
                Apply to multiple jobs with a single click using your uploaded resume
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-4">
              <div className="bg-appPurple-light p-3 rounded-full mb-4">
                <AlertCircle className="h-6 w-6 text-appPurple" />
              </div>
              <h3 className="font-medium mb-2">Personalized Matching</h3>
              <p className="text-sm text-gray-500">
                Get job recommendations that match your skills and experience
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-4">
              <div className="bg-appPurple-light p-3 rounded-full mb-4">
                <CheckCircle className="h-6 w-6 text-appPurple" />
              </div>
              <h3 className="font-medium mb-2">Track Applications</h3>
              <p className="text-sm text-gray-500">
                Keep track of all your applications in one place
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
