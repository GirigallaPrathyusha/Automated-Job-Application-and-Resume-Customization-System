
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FileCheck, Briefcase, Award, Search } from 'lucide-react';

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-appPurple-light to-white">
      <div className="container mx-auto px-4 py-16">
        <header className="flex justify-between items-center mb-16">
          <div className="flex items-center gap-2">
            <Briefcase className="h-8 w-8 text-appPurple" />
            <h1 className="text-2xl font-bold text-gray-800">JobFinder</h1>
          </div>
          <div className="flex gap-4">
            <Link to="/login">
              <Button variant="outline">Log in</Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-appPurple hover:bg-appSecondary">Sign up</Button>
            </Link>
          </div>
        </header>

        <main>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                Automate Your Job Search & Application Process
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Upload your resume once and apply to multiple jobs with just a click. Get personalized job recommendations based on your skills and experience.
              </p>
              <Link to="/signup">
                <Button size="lg" className="bg-appPurple hover:bg-appSecondary">
                  Get Started
                </Button>
              </Link>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg grid gap-6">
              <div className="flex gap-4 items-start">
                <div className="bg-appPurple-light p-3 rounded-full">
                  <FileCheck className="h-6 w-6 text-appPurple" />
                </div>
                <div>
                  <h3 className="font-semibold text-xl mb-1">Easy Resume Upload</h3>
                  <p className="text-gray-600">Upload your resume once and use it across all your applications.</p>
                </div>
              </div>
              
              <div className="flex gap-4 items-start">
                <div className="bg-appPurple-light p-3 rounded-full">
                  <Search className="h-6 w-6 text-appPurple" />
                </div>
                <div>
                  <h3 className="font-semibold text-xl mb-1">Smart Job Matching</h3>
                  <p className="text-gray-600">Get personalized job recommendations based on your skills and experience.</p>
                </div>
              </div>
              
              <div className="flex gap-4 items-start">
                <div className="bg-appPurple-light p-3 rounded-full">
                  <Award className="h-6 w-6 text-appPurple" />
                </div>
                <div>
                  <h3 className="font-semibold text-xl mb-1">One-Click Applications</h3>
                  <p className="text-gray-600">Apply to multiple jobs with a single click and track your application status.</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
