

import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User } from '@/api/entities';
import { Bot, Home, ShoppingBag, BookOpen, MessageSquare, Phone, Menu, LayoutDashboard, Brain, User as UserIcon } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navigationItems = [
  { title: "Home", url: createPageUrl("Home"), icon: Home, admin: false },
  { title: "Chat with Nouri", url: createPageUrl("Chat"), icon: MessageSquare, admin: false },
  { title: "Health Store", url: createPageUrl("Store"), icon: ShoppingBag, admin: false },
  { title: "Health Guides", url: createPageUrl("Blog"), icon: BookOpen, admin: false },
  { title: "AI Insights", url: createPageUrl("AIInsights"), icon: Brain, admin: false },
  { title: "My Profile", url: createPageUrl("Profile"), icon: UserIcon, admin: false },
  { title: "Contact", url: createPageUrl("Contact"), icon: Phone, admin: false },
  // New admin-only entry for the Claude Root Agent console
  { title: "Root Agent", url: createPageUrl("RootAgent"), icon: Brain, admin: true },
  { title: "Admin", url: createPageUrl("AdminDashboard"), icon: LayoutDashboard, admin: true },
];

export default function Layout({ children }) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await User.me();
        setUser(currentUser);
      } catch (e) {
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  const visibleNavItems = navigationItems.filter(item => !item.admin || (user && user.role === 'admin'));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      <style>{`
          /* ... existing styles ... */
      `}</style>

      <SidebarProvider>
        <div className="flex w-full min-h-screen">
          <Sidebar className="hidden lg:flex backdrop-blur-glass border-r border-cyan-500/20">
            <SidebarHeader className="p-6 border-b border-cyan-500/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-xl flex items-center justify-center glow-effect">
                  <Bot className="w-6 h-6 text-slate-900" />
                </div>
                <div>
                  <h2 className="font-bold text-xl text-white glow-text">HealthAIde.ai</h2>
                  <p className="text-xs text-cyan-300">Smarter Health. Powered by AI.</p>
                </div>
              </div>
            </SidebarHeader>
            
            <SidebarContent className="p-4">
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {visibleNavItems.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton 
                          asChild 
                          className={`mb-2 hover:bg-cyan-500/10 hover:text-cyan-300 transition-all duration-300 rounded-xl ${
                            location.pathname === item.url 
                              ? 'bg-cyan-500/20 text-cyan-300 neon-border' 
                              : 'text-slate-300'
                          }`}
                        >
                          <Link to={item.url} className="flex items-center gap-3 px-4 py-3">
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium">{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>

              {/* ... existing card ... */}
            </SidebarContent>
          </Sidebar>

          {/* Mobile Header */}
          <div className="lg:hidden fixed top-0 left-0 right-0 z-50 backdrop-blur-glass border-b border-cyan-500/20">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-lg flex items-center justify-center">
                  <Bot className="w-5 h-5 text-slate-900" />
                </div>
                <span className="font-bold text-lg text-white">HealthAIde.ai</span>
              </div>
              
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-white">
                    <Menu className="w-6 h-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="backdrop-blur-glass border-l border-cyan-500/20">
                  <div className="flex flex-col gap-6 mt-8">
                    {visibleNavItems.map((item) => (
                      <Link
                        key={item.title}
                        to={item.url}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                          location.pathname === item.url
                            ? 'bg-cyan-500/20 text-cyan-300 neon-border'
                            : 'text-slate-300 hover:bg-cyan-500/10 hover:text-cyan-300'
                        }`}
                      >
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium">{item.title}</span>
                      </Link>
                    ))}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Main Content */}
          <main className="flex-1 lg:ml-0 pt-20 lg:pt-0 overflow-auto">
            {children}
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
}

