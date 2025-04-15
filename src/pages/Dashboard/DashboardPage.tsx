
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileUp, CheckCircle, Clock, XCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useResume } from '@/contexts/ResumeContext';
import { motion } from 'framer-motion';

export default function DashboardPage() {
  const { user } = useAuth();
  const { resume, applications } = useResume();

  // Calculate application statistics
  const totalApplications = applications.length;
  const successfulApplications = applications.filter(app => app.status === 'Submitted Successfully').length;
  const failedApplications = applications.filter(app => app.status === 'Submission Failed').length;
  const processingApplications = applications.filter(app => app.status === 'Processing').length;

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
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        {!resume ? (
          <Link to="/upload-resume">
            <Button className="bg-appPurple hover:bg-appSecondary">
              <FileUp className="mr-2 h-4 w-4" />
              Upload Resume
            </Button>
          </Link>
        ) : null}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div variants={item}>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Applications</CardDescription>
              <CardTitle className="text-3xl">{totalApplications}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-gray-500">
                All time applications
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={item}>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Successfully Submitted</CardDescription>
              <CardTitle className="text-3xl text-success">{successfulApplications}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-gray-500">
                <CheckCircle className="inline-block h-4 w-4 mr-1" />
                Successful applications
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={item}>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Processing</CardDescription>
              <CardTitle className="text-3xl text-info">{processingApplications}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-gray-500">
                <Clock className="inline-block h-4 w-4 mr-1" />
                In progress
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={item}>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Failed Submissions</CardDescription>
              <CardTitle className="text-3xl text-error">{failedApplications}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-gray-500">
                <XCircle className="inline-block h-4 w-4 mr-1" />
                Failed attempts
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
