'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { CivicSolveLogo } from './icons';
import {
  LayoutDashboard,
  FilePlus2,
  Settings,
  CircleHelp,
} from 'lucide-react';
import { Separator } from './ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar className="border-r bg-sidebar text-sidebar-foreground dark:bg-card dark:text-foreground">
      <SidebarHeader className="p-4">
        <Link href="/" className="flex items-center gap-2 font-semibold font-headline text-lg">
          <CivicSolveLogo className="h-8 w-8 text-primary" />
          <span>CivicSolve</span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="p-4 flex flex-col justify-between">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === '/'}
              tooltip="Dashboard"
            >
              <Link href="/">
                <LayoutDashboard />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === '/report'}
              tooltip="Report an Issue"
            >
              <Link href="/report">
                <FilePlus2 />
                <span>Report an Issue</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === '/help'}
              tooltip="Help & Support"
            >
              <Link href="#">
                <CircleHelp />
                <span>Help & Support</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
             <SidebarMenuButton
              asChild
              isActive={pathname === '/settings'}
              tooltip="Settings"
            >
              <Link href="#">
                <Settings />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <Separator className="my-0 bg-border/50" />
      <SidebarFooter className="p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src="https://picsum.photos/seed/avatar/40/40" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium text-sm">Demo User</span>
            <span className="text-xs text-muted-foreground">user@example.com</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
