
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useTheme } from 'next-themes';
import { Sun, Moon, Laptop, Bell, Palette, User, CircleHelp, Mail, Phone, MessageSquarePlus } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Link from 'next/link';

export default function SettingsPage() {
  const { setTheme } = useTheme();
  const { user } = useAuth();

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Profile
          </CardTitle>
          <CardDescription>
            This is your public display name and email.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" defaultValue={user?.name || ''} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue={user?.email || ''} readOnly />
          </div>
           <Button>Update Profile</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
           <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Appearance
          </CardTitle>
          <CardDescription>
            Customize the look and feel of the application.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div>
                <Label>Theme</Label>
                 <p className="text-sm text-muted-foreground mb-2">Select the color scheme for the app.</p>
                <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={() => setTheme('light')}>
                        <Sun className="h-4 w-4 mr-2" /> Light
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setTheme('dark')}>
                        <Moon className="h-4 w-4 mr-2" /> Dark
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setTheme('system')}>
                        <Laptop className="h-4 w-4 mr-2" /> System
                    </Button>
                </div>
            </div>
        </CardContent>
      </Card>
      
       <Card>
        <CardHeader>
           <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notifications
          </CardTitle>
          <CardDescription>
            Manage how you receive notifications.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
            <div className="space-y-0.5">
              <Label>Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive email updates on your reported issues.
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
            <div className="space-y-0.5">
              <Label>Push Notifications</Label>
               <p className="text-sm text-muted-foreground">
                Get real-time alerts on your device.
              </p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CircleHelp className="w-5 h-5" />
            Help & Support
          </CardTitle>
          <CardDescription>
            Find answers to common questions and get in touch with our team.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
           <div>
             <h3 className="text-lg font-semibold mb-2">Frequently Asked Questions</h3>
             <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>How do I report a new issue?</AccordionTrigger>
                  <AccordionContent>
                    You can report a new issue from the Dashboard by clicking on one of the categories like "Garbage" or "Potholes". This will take you to a form where you can upload a photo and provide details.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>How can I track the status of my report?</AccordionTrigger>
                  <AccordionContent>
                    Your submitted reports appear on the Dashboard under "My Recent Reports". You can click on any report card to view its detailed timeline and current status.
                  </AccordionContent>
                </AccordionItem>
                 <AccordionItem value="item-3">
                  <AccordionTrigger>What do the different SLA statuses mean?</AccordionTrigger>
                  <AccordionContent>
                    SLA (Service Level Agreement) statuses indicate how your report is doing against its target resolution time. 'On Time' is good, 'At Risk' means the deadline is approaching, and 'Deadline Missed' means it's overdue.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
           </div>

           <div>
                <h3 className="text-lg font-semibold mb-2">Contact Us</h3>
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground"/>
                        <a href="mailto:support@civicsolve.com" className="hover:underline">support@civicsolve.com</a>
                    </div>
                     <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground"/>
                        <span>+1 (800) 555-0199</span>
                    </div>
                </div>
           </div>

            <div className="flex flex-wrap gap-2">
                <Button asChild>
                    <Link href="/report">
                        <MessageSquarePlus className="mr-2 h-4 w-4" />
                        Report a New Issue
                    </Link>
                </Button>
                <Button variant="outline" asChild>
                     <a href="mailto:feedback@civicsolve.com">Submit Feedback</a>
                </Button>
            </div>
        </CardContent>
      </Card>

    </div>
  );
}
