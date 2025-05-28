import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useResume } from '@/contexts/ResumeContext';
import { useToast } from '@/components/ui/use-toast';
import { FileUp, CheckCircle } from 'lucide-react';

export default function UploadResumePage() {
  const [isReplacing, setIsReplacing] = useState(false);
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
    
    if (file.size > 5 * 1024 * 1024) {
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
        description: "Your resume has been stored successfully",
      });
      setIsReplacing(false);
      navigate('/job-listings'); // Update this path to match your router configuration
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to store resume",
        variant: "destructive",
      });
    }
  };

  // Modify handleFileChange to handle both cases the same way
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      validateAndSetFile(selectedFile);
    }
  };
  
  // Remove validateAndUploadFile since we'll use handleUpload for both cases
  
  // Update handleReplace to show the upload interface
  const handleReplace = () => {
    setIsReplacing(true);
    setFile(null);
    fileInputRef.current?.click();
  };
  
  // Update the CardContent render condition
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Upload Your Resume</h1>
        <p className="text-gray-500 mt-2">
          Upload your resume to get started
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
          {resume && !isReplacing ? (
            // Success state - show uploaded resume
            <div className="bg-green-50 border border-green-100 rounded-lg p-6 text-center">
              <CheckCircle className="h-12 w-12 text-success mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Resume Uploaded</h3>
              <p className="text-sm text-gray-500 mb-6">
                Your resume: <strong>{resume.fileName}</strong> is stored
              </p>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf,.docx"
                className="hidden"
              />
              <Button 
                variant="outline"
                onClick={handleReplace}
              >
                Replace Resume
              </Button>
            </div>
          ) : isReplacing && file ? (
            // Show store button after file selection in replace mode
            <div className="bg-green-50 border border-green-100 rounded-lg p-6 text-center">
              <h3 className="text-lg font-medium mb-2">{file.name}</h3>
              <p className="text-sm text-gray-500 mb-6">
                {`${(file.size / 1024 / 1024).toFixed(2)}MB`}
              </p>
              <Button 
                onClick={handleUpload}
                disabled={isUploading}
              >
                {isUploading ? "Storing..." : "Store Resume"}
              </Button>
            </div>
          ) : (
            // Original drag & drop interface for first upload
            <div className={`border-2 border-dashed rounded-lg p-12 text-center ${
              isDragging ? 'border-primary bg-primary/10' : 'border-gray-300 hover:border-primary'
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
                  ? `${(file.size / 1024 / 1024).toFixed(2)}MB` 
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
                  onClick={handleUpload}
                  disabled={isUploading}
                >
                  {isUploading ? "Storing..." : "Store Resume"}
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
    </div>
  );
}


