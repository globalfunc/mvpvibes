import { router, usePage } from '@inertiajs/react';
import { LayoutGrid, Calendar, CalendarCheck, Settings, LogOut } from 'lucide-react';
import AppLogoIcon from '@/components/app-logo-icon';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';

const navItems = [
    { title: 'Dashboard',        href: '/admin/dashboard',        icon: LayoutGrid },
    { title: 'Availability',     href: '/admin/availability',     icon: Calendar },
    { title: 'Booked Sessions',  href: '/admin/booked-sessions',  icon: CalendarCheck },
    { title: 'Settings',         href: '/admin/settings',         icon: Settings },
];

export function AdminSidebar() {
    const { url } = usePage();
    const { admin } = usePage().props as { admin?: { name: string; email: string } };

    const handleLogout = () => {
        router.post('/admin/logout');
    };

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <a href="/admin/dashboard" className="flex items-center gap-2">
                                <AppLogoIcon className="size-7 fill-current text-white" />
                                <span className="font-bold text-sm tracking-widest uppercase text-white/80">Admin</span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <SidebarMenu>
                    {navItems.map(({ title, href, icon: Icon }) => {
                        const isActive = url.startsWith(href);
                        return (
                            <SidebarMenuItem key={href}>
                                <SidebarMenuButton asChild isActive={isActive}>
                                    <a href={href} className="flex items-center gap-2">
                                        <Icon className="size-4" />
                                        <span>{title}</span>
                                    </a>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        );
                    })}
                </SidebarMenu>
            </SidebarContent>

            <SidebarFooter>
                <SidebarMenu>
                    {admin && (
                        <SidebarMenuItem>
                            <div className="px-2 py-1.5 text-xs text-sidebar-foreground/50 truncate">
                                {admin.name ?? admin.email}
                            </div>
                        </SidebarMenuItem>
                    )}
                    <SidebarMenuItem>
                        <SidebarMenuButton onClick={handleLogout} className="text-red-400 hover:text-red-300 hover:bg-red-400/10">
                            <LogOut className="size-4" />
                            <span>Logout</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
