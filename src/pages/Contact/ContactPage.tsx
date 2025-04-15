
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';

export default function ContactPage() {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send the data to a server
    toast({
      title: "Message sent successfully",
      description: "We'll get back to you as soon as possible.",
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto p-4"
    >
      <Card>
        <CardHeader>
          <CardTitle>Contact Us</CardTitle>
          <CardDescription>
            Have a question or concern? We're here to help.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="name">Name</label>
              <Input id="name" placeholder="Your name" required />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="email">Email</label>
              <Input id="email" type="email" placeholder="Your email" required />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="message">How can we help?</label>
              <Textarea 
                id="message" 
                placeholder="Tell us about your issue or question"
                className="min-h-[150px]"
                required 
              />
            </div>
            
            <Button type="submit" className="w-full bg-appPurple hover:bg-appSecondary">
              Submit
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
