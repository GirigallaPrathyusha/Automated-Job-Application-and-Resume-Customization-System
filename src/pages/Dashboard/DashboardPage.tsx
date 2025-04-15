
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileUp, Briefcase, CheckCircle, Clock, XCircle, BarChart3, PieChart } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useResume } from '@/contexts/ResumeContext';
import { useNotifications } from '@/contexts/NotificationContext';

export default function DashboardPage() {
  const { user } = useAuth();
  const { resume, applications } = useResume();
  const { notifications, unreadCount } = useNotifications();

  // Calculate application statistics
  const totalApplications = applications.length;
  const successfulApplications = applications.filter(app => app.status === 'Submitted Successfully').length;
  const failedApplications = applications.filter(app => app.status === 'Submission Failed').length;
  const processingApplications = applications.filter(app => app.status === 'Processing').length;
  const shortlistedApplications = applications.filter(app => app.status === 'Shortlisted').length;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        {!resume ? (
          <Link to="/upload-resume">
            <Button className="bg-appPurple hover:bg-appSecondary">
              <FileUp className="mr-2 h-4 w-4" />
              Upload Resume
            </Button>
          </Link>
        ) : (
          <Link to="/job-listings">
            <Button className="bg-appPurple hover:bg-appSecondary">
              <Briefcase className="mr-2 h-4 w-4" />
              Browse Jobs
            </Button>
          </Link>
        )}
      </div>

      {/* Welcome Card */}
      <Card>
        <CardHeader>
          <CardTitle>Welcome back, {user?.firstName}!</CardTitle>
          <CardDescription>
            {resume 
              ? "Here's an overview of your job applications and activity" 
              : "Upload your resume to get started with job applications"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!resume ? (
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
              <FileUp className="h-16 w-16 text-appPurple opacity-50" />
              <div>
                <h3 className="text-lg font-medium">You haven't uploaded your resume yet</h3>
                <p className="text-sm text-gray-500 mb-4">Upload your resume to get personalized job recommendations</p>
                <Link to="/upload-resume">
                  <Button className="bg-appPurple hover:bg-appSecondary">
                    Upload Resume Now
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-sm">
              <p>
                Last resume upload: <span className="font-medium">{new Date(resume.uploadDate).toLocaleDateString()}</span>
              </p>
              <p className="mt-2">
                Resume file: <span className="font-medium">{resume.fileName}</span>
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Applications</CardDescription>
            <CardTitle className="text-3xl">{totalApplications}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-gray-500">
              <Briefcase className="inline-block h-4 w-4 mr-1" />
              All time
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Successfully Submitted</CardDescription>
            <CardTitle className="text-3xl text-success">{successfulApplications}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-gray-500">
              <CheckCircle className="inline-block h-4 w-4 mr-1" />
              Applications
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Processing</CardDescription>
            <CardTitle className="text-3xl text-info">{processingApplications}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-gray-500">
              <Clock className="inline-block h-4 w-4 mr-1" />
              Applications
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Failed Submissions</CardDescription>
            <CardTitle className="text-3xl text-error">{failedApplications}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-gray-500">
              <XCircle className="inline-block h-4 w-4 mr-1" />
              Applications
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Application Status Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Application Status</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center items-center p-6">
            {totalApplications > 0 ? (
              <div className="w-full h-48">
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div 
                        className="bg-success rounded-full h-4" 
                        style={{ width: `${(successfulApplications / totalApplications) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-medium">Submitted</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div 
                        className="bg-info rounded-full h-4" 
                        style={{ width: `${(processingApplications / totalApplications) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-medium">Processing</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div 
                        className="bg-error rounded-full h-4" 
                        style={{ width: `${(failedApplications / totalApplications) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-medium">Failed</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div 
                        className="bg-warning rounded-full h-4" 
                        style={{ width: `${(shortlistedApplications / totalApplications) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-medium">Shortlisted</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-30" />
                <p>No application data to display</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Notifications */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Recent Notifications</CardTitle>
              <CardDescription>Stay updated on your applications</CardDescription>
            </div>
            {unreadCount > 0 && (
              <Link to="/notifications">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            )}
          </CardHeader>
          <CardContent>
            {notifications.length > 0 ? (
              <div className="space-y-4">
                {notifications.slice(0, 3).map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`p-3 rounded-lg ${
                      notification.read ? 'bg-gray-50' : 'bg-appPurple-light'
                    }`}
                  >
                    <p className="text-sm">{notification.message}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-gray-500">
                        {new Date(notification.date).toLocaleDateString()}
                      </span>
                      {!notification.read && (
                        <span className="text-xs bg-appPurple text-white px-2 py-1 rounded-full">
                          New
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <p>No notifications yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
