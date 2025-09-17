
'use client';

import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import { AppHeader } from '@/components/app-header'
import { ThemeProvider } from 'next-themes'
import { usePathname } from 'next/navigation'
import { AuthProvider } from '@/hooks/use-auth'

const metadata: Metadata = {
  title: 'CivicSolve',
  description: 'Report and resolve civic issues in your community.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/';
  
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
            <div className="flex flex-col flex-1 h-full">
              {isLoginPage ? (
                <main className="flex-1">{children}</main>
              ) : (
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
              )}
            </div>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
