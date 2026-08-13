"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Building2,
  Handshake,
  CheckSquare,
  Package,
  Mail,
  Puzzle,
  Settings,
  ChevronLeft,
  User,
  Calendar,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AppSidebarProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  clinicSlug?: string;
}

export function AppSidebar({ user, clinicSlug }: AppSidebarProps) {
  const pathname = usePathname();
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";

  const mainMenuItems = [
    {
      title: "Dashboard",
      url: clinicSlug ? `/clinica/${clinicSlug}/dashboard` : "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Profissionais",
      url: clinicSlug ? `/clinica/${clinicSlug}/dashboard/profissionais` : "/dashboard/profissionais",
      icon: Users,
    },
    {
      title: "Serviços",
      url: clinicSlug ? `/clinica/${clinicSlug}/dashboard/servicos` : "/dashboard/servicos",
      icon: Package,
    },
    {
      title: "Agendamentos",
      url: clinicSlug ? `/clinica/${clinicSlug}/dashboard/agendamentos` : "/dashboard/agendamentos",
      icon: Calendar,
    },
    {
      title: "Tasks",
      url: clinicSlug ? `/clinica/${clinicSlug}/dashboard/tasks` : "/dashboard/tasks",
      icon: CheckSquare,
    },
  ];

  const marketingItems = [
    {
      title: "Products",
      url: clinicSlug ? `/clinica/${clinicSlug}/dashboard/products` : "/dashboard/products",
      icon: Package,
    },
    {
      title: "Emails",
      url: clinicSlug ? `/clinica/${clinicSlug}/dashboard/emails` : "/dashboard/emails",
      icon: Mail,
    },
  ];

  const preferencesItems = [
    {
      title: "Integrations",
      url: clinicSlug ? `/clinica/${clinicSlug}/dashboard/integrations` : "/dashboard/integrations",
      icon: Puzzle,
    },
    {
      title: "Settings",
      url: clinicSlug ? `/clinica/${clinicSlug}/dashboard/settings` : "/dashboard/settings",
      icon: Settings,
    },
  ];

  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "U";

  return (
    <Sidebar collapsible="icon" className="border-r bg-background">
      <SidebarHeader className="border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
              JB
            </div>
            {!isCollapsed && (
              <span className="font-semibold text-lg">Better Auth</span>
            )}
          </Link>
          {!isCollapsed && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={toggleSidebar}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Main Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    tooltip={item.title}
                    className={cn(
                      "transition-colors",
                      pathname === item.url &&
                        "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                    )}
                  >
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Marketing
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {marketingItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    tooltip={item.title}
                    className={cn(
                      "transition-colors",
                      pathname === item.url &&
                        "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                    )}
                  >
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Preferences
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {preferencesItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    tooltip={item.title}
                    className={cn(
                      "transition-colors",
                      pathname === item.url &&
                        "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                    )}
                  >
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        {!isCollapsed && (
          <div className="mb-4 rounded-lg bg-muted p-3">
            <p className="text-xs text-muted-foreground mb-1">20 days left</p>
            <p className="text-xs text-muted-foreground mb-2">
              Upgrade to premium and enjoy the benefits for a long time.
            </p>
            <Button size="sm" variant="outline" className="w-full text-xs">
              View plan
            </Button>
          </div>
        )}
        <Link
          href="/profile"
          className="flex items-center gap-3 rounded-lg p-2 hover:bg-muted transition-colors"
        >
          <Avatar className="h-9 w-9">
            <AvatarImage src={user?.image || ""} alt={user?.name || "User"} />
            <AvatarFallback className="bg-primary/10 text-primary text-sm">
              {initials}
            </AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">
                {user?.name || "User"}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.email || "user@example.com"}
              </p>
            </div>
          )}
        </Link>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
