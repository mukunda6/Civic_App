
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useTheme } from 'next-themes';
import { Sun, Moon, Laptop, Bell, Palette, Globe, User } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

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
            <Separator />
             <div>
                <Label>Language</Label>
                <p className="text-sm text-muted-foreground mb-2">Choose your preferred language.</p>
                <Select defaultValue="en">
                    <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Language" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="te">Telugu</SelectItem>
                        <SelectItem value="hi">Hindi</SelectItem>
                        <SelectItem value="ur">Urdu</SelectItem>
                    </SelectContent>
                </Select>
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

    </div>
  );
}
