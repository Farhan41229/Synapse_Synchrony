import { ModeToggle } from '@/components/mode-toggle';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useAuthStore } from '@/store/authStore';
import { LogOut, Settings, User } from 'lucide-react';
import React from 'react';
import { Link, useNavigate } from 'react-router';

const DashboardNavbar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const avatarUrl = user?.avatar || null;
  const displayName = user?.name || '';

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="p-4 flex items-center justify-between border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
      <SidebarTrigger />
      <div className="flex items-center gap-4">
        <Link to={'/'} className="text-sm font-medium hover:text-primary transition-colors">Home</Link>
        <ModeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar className="cursor-pointer ring-2 ring-primary/20 hover:ring-primary/50 transition-all">
              <AvatarImage
                src={avatarUrl ?? undefined}
                alt={displayName || 'User avatar'}
                referrerPolicy="no-referrer"
                key={avatarUrl ?? 'no-photo'}
                onError={(e) => {
                  e.currentTarget.src = '/avatar-placeholder.png';
                }}
              />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {displayName
                  ?.split(' ')
                  .map((s) => s[0])
                  .join('')
                  .slice(0, 2) || 'SS'}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link className="flex gap-2 items-center w-full" to={'/dashboard/profile'}>
                <User className="h-[1.2rem] w-[1.2rem]" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link className="flex gap-2 items-center w-full" to={'/dashboard/settings'}>
                <Settings className="h-[1.2rem] w-[1.2rem]" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
              <LogOut className="h-[1.2rem] w-[1.2rem] mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default DashboardNavbar;
