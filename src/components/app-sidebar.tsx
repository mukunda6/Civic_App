
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
  Trophy,
  Users,
} from 'lucide-react';
import { Separator } from './ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useAuth } from '@/hooks/use-auth';
import { useIsMobile } from '@/hooks/use-mobile';
import { useEffect, useState } from 'react';

export function AppSidebar() {
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <Sidebar className="border-r bg-sidebar text-sidebar-foreground dark:bg-card dark:text-foreground">
      <SidebarHeader className="p-4">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold font-headline text-lg">
          <CivicSolveLogo className="h-8 w-8 text-primary" />
          <span>CivicSolve</span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="p-4 flex flex-col justify-between">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === '/dashboard'}
              tooltip="Dashboard"
            >
              <Link href="/dashboard">
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
           {user?.role === 'Citizen' && (
            <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === '/user-leaderboard'}
                  tooltip="Leaderboard and Rewards"
                >
                  <Link href="/user-leaderboard">
                    <Trophy />
                    <span>Leaderboard &amp; Rewards</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
          {(user?.role === 'Admin' || user?.role === 'Head') && (
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === '/leaderboard'}
                tooltip="Admin Leaderboard"
              >
                <Link href="/leaderboard">
                  <Trophy />
                  <span>Admin Leaderboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
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
        {!loading && user && (
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.avatarUrl} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium text-sm">{user.name}</span>
              <span className="text-xs text-muted-foreground">{user.email}</span>
            </div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
