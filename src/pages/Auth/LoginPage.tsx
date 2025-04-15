
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Briefcase, ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden md:flex md:w-1/2 bg-appPurple-light items-center justify-center">
        <div className="max-w-md p-8">
          <div className="flex items-center gap-2 mb-6">
            <Briefcase className="h-8 w-8 text-appPurple" />
            <h1 className="text-2xl font-bold text-gray-800">JobFinder</h1>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Welcome back to your job search assistant
          </h2>
          <p className="text-lg text-gray-600">
            Log in to continue your job search journey, track your applications, and discover new opportunities.
          </p>
        </div>
      </div>
      
      <div className="w-full md:w-1/2 flex flex-col p-8">
        <Link to="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-12 self-start">
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>
        
        <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
          <div className="flex items-center gap-2 mb-2 md:hidden">
            <Briefcase className="h-8 w-8 text-appPurple" />
            <h1 className="text-2xl font-bold text-gray-800">JobFinder</h1>
          </div>
          <h2 className="text-2xl font-bold mb-8">Log in to your account</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <Link to="/forgot-password" className="text-xs text-appPurple hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-appPurple hover:bg-appSecondary"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Log in"}
            </Button>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link to="/signup" className="text-appPurple hover:underline font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
