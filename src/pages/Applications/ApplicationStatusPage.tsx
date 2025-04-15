
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useResume } from '@/contexts/ResumeContext';
import { Application } from '@/types';
import { FileDown } from 'lucide-react';

export default function ApplicationStatusPage() {
  const { applications } = useResume();
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  
  const handleViewDetails = (application: Application) => {
    setSelectedApplication(application);
    setIsDetailsOpen(true);
  };
  
  const getStatusClassName = (status: string) => {
    switch (status) {
      case 'Submitted Successfully':
        return 'bg-green-100 text-green-800';
      case 'Submission Failed':
        return 'bg-red-100 text-red-800';
      case 'Processing':
        return 'bg-blue-100 text-blue-800';
      case 'Shortlisted':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Application Submission Status</h1>
        <p className="text-gray-500 mt-2">
          Track the status of all your job applications
        </p>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableCaption>A list of your job applications</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Job Title</TableHead>
                <TableHead>Company Name</TableHead>
                <TableHead>Submission Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.length > 0 ? (
                applications.map((application) => (
                  <TableRow key={application.id}>
                    <TableCell className="font-medium">{application.job.title}</TableCell>
                    <TableCell>{application.job.company}</TableCell>
                    <TableCell>{new Date(application.submissionDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusClassName(application.status)}`}>
                        {application.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      {application.status === 'Submission Failed' ? (
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          className="text-white"
                          onClick={() => handleViewDetails(application)}
                        >
                          Retry
                        </Button>
                      ) : (
                        <Button 
                          size="sm"
                          variant="secondary"
                          className="bg-appPurple-light text-appPurple hover:bg-appPurple hover:text-white"
                          onClick={() => handleViewDetails(application)}
                        >
                          View Details
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10">
                    <div className="text-gray-500">
                      <p className="mb-2">No applications submitted yet</p>
                      <Button 
                        variant="outline"
                        onClick={() => window.location.href = '/job-listings'}
                      >
                        Browse Jobs
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
      
      {/* Application Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
            <DialogDescription>
              {selectedApplication?.job.title} at {selectedApplication?.job.company}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 pt-4">
            <div className={`p-4 rounded-lg text-center ${
              selectedApplication?.status === 'Submitted Successfully' 
                ? 'bg-green-50 border border-green-100' 
                : 'bg-red-50 border border-red-100'
            }`}>
              <h3 className={`text-lg font-medium ${
                selectedApplication?.status === 'Submitted Successfully'
                  ? 'text-green-800'
                  : 'text-red-800'
              }`}>
                {selectedApplication?.status}
              </h3>
              <p className="text-sm text-gray-500 mt-2">
                {selectedApplication?.status === 'Submitted Successfully'
                  ? 'Your application was submitted successfully to the employer.'
                  : 'There was an error submitting your application. Please try again.'}
              </p>
            </div>
            
            <div>
              <p className="text-sm font-medium mb-1">Submission Date</p>
              <p className="text-sm text-gray-500">
                {selectedApplication?.submissionDate 
                  ? new Date(selectedApplication.submissionDate).toLocaleString() 
                  : ''}
              </p>
            </div>
            
            <div>
              <p className="text-sm font-medium mb-1">Resume</p>
              <div className="flex items-center gap-2">
                <p className="text-sm text-gray-500">
                  {selectedApplication?.resume.fileName}
                </p>
                <Button variant="outline" size="sm" className="ml-auto">
                  <FileDown className="h-4 w-4 mr-1" />
                  Download Resume
                </Button>
              </div>
            </div>
            
            <div className="flex justify-end pt-4 space-x-2">
              {selectedApplication?.status === 'Submission Failed' && (
                <Button 
                  variant="default"
                  className="bg-appPurple hover:bg-appSecondary"
                >
                  Retry Application
                </Button>
              )}
              
              <Button
                variant="outline"
                onClick={() => setIsDetailsOpen(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
