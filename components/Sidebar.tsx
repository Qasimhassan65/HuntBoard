"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Briefcase, Users, BarChart3, Bell, Settings, LogIn, LogOut } from "lucide-react";
import clsx from "clsx";
import { useStore } from "@/store/useStore";
import { auth, googleProvider } from "@/lib/firebase";
import { linkWithPopup, signInWithPopup, signOut } from "firebase/auth";

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Jobs", href: "/jobs", icon: Briefcase },
  { name: "Networking", href: "/networking", icon: Users },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, setAuthModalOpen } = useStore();

  const handleSignIn = () => {
    setAuthModalOpen(true);
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  return (
    <aside className="w-60 bg-surface border-r border-border flex flex-col h-screen fixed left-0 top-0 text-text-primary">
      <div className="p-6">
        <h1 className="text-xl font-bold tracking-tight text-text-primary">
          HuntBoard
        </h1>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-accent/10 text-accent"
                  : "text-text-secondary hover:text-text-primary hover:bg-surface-alt"
              )}
            >
              <item.icon className={clsx("w-5 h-5", isActive ? "text-accent" : "text-text-secondary")} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        {user && !user.isAnonymous ? (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 px-3 py-2">
              <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center text-xs font-bold">
                {user.email?.[0].toUpperCase() || "U"}
              </div>
              <span className="text-sm font-medium truncate">{user.email}</span>
            </div>
            <button
              onClick={handleSignOut}
              className="flex w-full items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors text-text-secondary hover:text-danger hover:bg-danger/10"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        ) : (
          <button
            onClick={handleSignIn}
            className="flex w-full items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors bg-accent text-white hover:bg-accent-hover"
          >
            <LogIn className="w-5 h-5" />
            Sign In / Sign Up
          </button>
        )}
      </div>
    </aside>
  );
}
