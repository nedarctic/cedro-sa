"use client"

import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  ChartBarIcon,
  FolderIcon,
  LayoutDashboardIcon,
  ListIcon,
  SettingsIcon,
  UsersIcon,
  BookIcon
} from "lucide-react"
import Link from "next/link"
import { useTransition, useState } from 'react'

const data = {
  
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: (
        <LayoutDashboardIcon
        />
      ),
    },
    {
      title: "Tours",
      url: "/tours",
      icon: (
        <ListIcon
        />
      ),
    },
    {
      title: "Itineraries",
      url: "/itineraries",
      icon: (
        <ChartBarIcon
        />
      ),
    },
    {
      title: "Bookings",
      url: "/bookings",
      icon: (
        <BookIcon
        />
      ),
    },
    {
      title: "Blogs",
      url: "/blogs",
      icon: (
        <FolderIcon
        />
      ),
    },
    {
      title: "Team",
      url: "/team",
      icon: (
        <UsersIcon
        />
      ),
    },

    {
      title: "Settings",
      url: "/settings",
      icon: (
        <SettingsIcon
        />
      ),
    },],
}

export type User = {
  name: string;
  email: string;
  role: UserRole;
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

enum UserRole {
  ADMIN,
  SUPER_ADMIN
}

export function AppSidebar({ user, ...props }: { user: User, props: React.ComponentProps<typeof Sidebar> }) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link href="/">
                <span className="text-base font-semibold">Cedro Adventures</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
