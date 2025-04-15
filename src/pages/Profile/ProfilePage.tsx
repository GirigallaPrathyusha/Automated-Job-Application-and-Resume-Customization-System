
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PencilIcon, User, Lock, Save } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    location: user?.location || '',
    phone: user?.phone || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    
    updateUser({
      firstName: formData.firstName,
      lastName: formData.lastName,
      location: formData.location,
      phone: formData.phone,
    });
    
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully",
    });
    
    setIsEditing(false);
  };

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "New password and confirm password must match",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, you'd validate the current password against the stored one
    // and use an API to update the password
    
    toast({
      title: "Password updated",
      description: "Your password has been updated successfully",
    });
    
    setFormData({
      ...formData,
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container max-w-4xl mx-auto p-4"
    >
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Profile Settings</h1>
        <Button 
          onClick={() => setIsEditing(!isEditing)}
          variant="outline"
          className={isEditing ? "bg-secondary" : ""}
        >
          {isEditing ? 'Cancel' : <><PencilIcon className="mr-2 h-4 w-4" /> Edit Profile</>}
        </Button>
      </div>

      <div className="grid gap-6 mb-6">
        <Card>
          <CardHeader className="pb-0">
            <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="text-2xl bg-appPurple text-white">
                  {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1 text-center sm:text-left">
                <CardTitle className="text-2xl">{user?.firstName} {user?.lastName}</CardTitle>
                <p className="text-gray-500">{user?.email}</p>
                {user?.location && <p className="text-gray-500">{user?.location}</p>}
                {user?.phone && <p className="text-gray-500">{user?.phone}</p>}
              </div>
            </div>
          </CardHeader>
        </Card>

        <Tabs defaultValue="account">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="account">
              <User className="mr-2 h-4 w-4" /> Account
            </TabsTrigger>
            <TabsTrigger value="security">
              <Lock className="mr-2 h-4 w-4" /> Security
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First name</Label>
                      <Input 
                        id="firstName" 
                        name="firstName"
                        disabled={!isEditing}
                        value={formData.firstName}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last name</Label>
                      <Input 
                        id="lastName" 
                        name="lastName"
                        disabled={!isEditing}
                        value={formData.lastName}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      name="email"
                      type="email"
                      disabled={true}
                      value={formData.email}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input 
                        id="location" 
                        name="location"
                        disabled={!isEditing}
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="City, Country"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone number</Label>
                      <Input 
                        id="phone" 
                        name="phone"
                        disabled={!isEditing}
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>
                  
                  {isEditing && (
                    <Button 
                      type="submit" 
                      className="w-full bg-appPurple hover:bg-appSecondary"
                    >
                      <Save className="mr-2 h-4 w-4" /> Save Changes
                    </Button>
                  )}
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Password & Security</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordUpdate} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current password</Label>
                    <Input 
                      id="currentPassword" 
                      name="currentPassword"
                      type="password"
                      value={formData.currentPassword}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New password</Label>
                      <Input 
                        id="newPassword" 
                        name="newPassword"
                        type="password"
                        value={formData.newPassword}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm new password</Label>
                      <Input 
                        id="confirmPassword" 
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-appPurple hover:bg-appSecondary"
                    disabled={!formData.currentPassword || !formData.newPassword || !formData.confirmPassword}
                  >
                    Update Password
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </motion.div>
  );
}
