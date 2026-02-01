import { Link, useLocation } from "wouter";
import { LayoutDashboard, PlusCircle, Activity } from "lucide-react";

export function Navigation() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/create", label: "New Job", icon: PlusCircle },
  ];

  return (
    <div className="w-64 flex-shrink-0 min-h-screen bg-white border-r border-border hidden md:flex flex-col sticky top-0">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
            <Activity className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">JobScheduler</h1>
            <p className="text-xs text-muted-foreground">Admin Panel</p>
          </div>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer
                    ${isActive 
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/25" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }
                  `}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-border/50">
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-xl border border-indigo-100">
          <p className="text-xs font-semibold text-indigo-900 mb-1">System Status</p>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs text-indigo-700">Operational</span>
          </div>
        </div>
      </div>
    </div>
  );
}
