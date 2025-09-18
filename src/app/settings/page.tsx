
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
import { useLanguage } from '@/hooks/use-language';

export default function SettingsPage() {
  const { setTheme } = useTheme();
  const { user } = useAuth();
  const { t } = useLanguage();

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          {t('settings')}
        </h1>
        <p className="text-muted-foreground">
          {t('settings_desc')}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            {t('profile')}
          </CardTitle>
          <CardDescription>
            {t('profile_desc')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t('full_name')}</Label>
            <Input id="name" defaultValue={user?.name || ''} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">{t('email')}</Label>
            <Input id="email" type="email" defaultValue={user?.email || ''} readOnly />
          </div>
           <Button>{t('update_profile')}</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
           <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            {t('appearance')}
          </CardTitle>
          <CardDescription>
            {t('appearance_desc')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div>
                <Label>{t('theme')}</Label>
                 <p className="text-sm text-muted-foreground mb-2">{t('theme_desc')}</p>
                <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={() => setTheme('light')}>
                        <Sun className="h-4 w-4 mr-2" /> {t('light')}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setTheme('dark')}>
                        <Moon className="h-4 w-4 mr-2" /> {t('dark')}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setTheme('system')}>
                        <Laptop className="h-4 w-4 mr-2" /> {t('system')}
                    </Button>
                </div>
            </div>
        </CardContent>
      </Card>
      
       <Card>
        <CardHeader>
           <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            {t('notifications')}
          </CardTitle>
          <CardDescription>
            {t('notifications_desc')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
            <div className="space-y-0.5">
              <Label>{t('email_notifications')}</Label>
              <p className="text-sm text-muted-foreground">
                {t('email_notifications_desc')}
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
            <div className="space-y-0.5">
              <Label>{t('push_notifications')}</Label>
               <p className="text-sm text-muted-foreground">
                {t('push_notifications_desc')}
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
            {t('help_support')}
          </CardTitle>
          <CardDescription>
            {t('help_support_desc')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
           <div>
             <h3 className="text-lg font-semibold mb-2">{t('faq')}</h3>
             <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>{t('faq_q1')}</AccordionTrigger>
                  <AccordionContent>
                    {t('faq_a1')}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>{t('faq_q2')}</AccordionTrigger>
                  <AccordionContent>
                    {t('faq_a2')}
                  </AccordionContent>
                </AccordionItem>
                 <AccordionItem value="item-3">
                  <AccordionTrigger>{t('faq_q3')}</AccordionTrigger>
                  <AccordionContent>
                    {t('faq_a3')}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
           </div>

           <div>
                <h3 className="text-lg font-semibold mb-2">{t('contact_us')}</h3>
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
                        {t('report_new_issue')}
                    </Link>
                </Button>
                <Button variant="outline" asChild>
                     <a href="mailto:feedback@civicsolve.com">{t('submit_feedback')}</a>
                </Button>
            </div>
        </CardContent>
      </Card>

    </div>
  );
}
