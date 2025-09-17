
'use client';

import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import { AppHeader } from '@/components/app-header'
import { ThemeProvider } from 'next-themes'
import { usePathname } from 'next/navigation'
import { AuthProvider, useAuth } from '@/hooks/use-auth'
import { Loader2 } from 'lucide-react';

const metadata: Metadata = {
  title: 'CivicSolve',
  description: 'Report and resolve civic issues in your community.',
}

function AppContent({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  
  // Determine if the current page is a public-facing page
  const isPublicPage = ['/', '/signup'].includes(pathname);

  if (loading && !isPublicPage) {
     return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // If auth is loading on a public page, or if there's no user on a private page, show a loader
  if ((loading && isPublicPage) || (!user && !isPublicPage)) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // If the user is logged in or on a public page, show the content.
  const showSidebar = user && !isPublicPage;

  return (
    <div className="flex flex-col flex-1 h-full">
      {showSidebar ? (
        <SidebarProvider>
          <div className="flex flex-1 min-h-0">
            <AppSidebar />
            <div className="flex flex-col flex-1">
              <AppHeader />
              <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-background overflow-y-auto">
                {children}
              </main>
            </div>
          </div>
        </SidebarProvider>
      ) : (
         <main className="flex-1">{children}</main>
      )}
    </div>
  );
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <AppContent>{children}</AppContent>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
