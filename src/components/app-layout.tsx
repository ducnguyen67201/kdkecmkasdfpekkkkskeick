"use client"

import * as React from "react"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "~/components/ui/sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb"
import { Separator } from "~/components/ui/separator"
import { AppSidebar } from "~/components/app-sidebar"
import Link from "next/link"

interface BreadcrumbItemType {
  label: string
  href?: string
}

interface AppLayoutProps {
  children: React.ReactNode
  breadcrumbs?: BreadcrumbItemType[]
  user?: {
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

export function AppLayout({ children, breadcrumbs = [], user }: AppLayoutProps) {
  return (
    <SidebarProvider className="flex min-h-screen w-full">
      <AppSidebar
        user={user}
        className="group-data-[state=expanded]:border-r group-data-[state=collapsed]:border-0"
      />
      <SidebarInset className="flex flex-1 flex-col overflow-y-auto transition-[margin-left] duration-200 ease-linear md:ml-[var(--sidebar-width)] md:peer-data-[state=collapsed]:ml-[var(--sidebar-width-icon)]">
        {/* Header with Breadcrumb */}
        <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs.length === 0 ? (
                <BreadcrumbItem>
                  <BreadcrumbPage>Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              ) : (
                breadcrumbs.map((item, index) => (
                  <React.Fragment key={index}>
                    <BreadcrumbItem>
                      {index === breadcrumbs.length - 1 ? (
                        <BreadcrumbPage>{item.label}</BreadcrumbPage>
                      ) : item.href ? (
                        <BreadcrumbLink asChild>
                          <Link href={item.href}>{item.label}</Link>
                        </BreadcrumbLink>
                      ) : (
                        <BreadcrumbPage>{item.label}</BreadcrumbPage>
                      )}
                    </BreadcrumbItem>
                    {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                  </React.Fragment>
                ))
              )}
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        {/* Main Content */}
        <div className="flex flex-1 flex-col">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
