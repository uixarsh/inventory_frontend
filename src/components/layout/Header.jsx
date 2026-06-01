import { useLocation } from "react-router-dom";
import { Bell, CheckCircle2, AlertTriangle } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState } from "react";

const routeMap = {
  "/": "Dashboard Overview",
  "/products": "Products Management",
  "/customers": "Customers Directory",
  "/orders": "Order Processing",
  "/orders/new": "Create New Order",
};

export default function Header() {
  const location = useLocation();
  const title = routeMap[location.pathname] || "Admin Panel";
  const [hasUnread, setHasUnread] = useState(true);

  return (
    <header className="h-16 glass border-b border-white/5 flex items-center justify-between px-8 sticky top-0 z-30">
      <h2 className="text-lg font-semibold tracking-tight text-foreground">
        {title}
      </h2>
      <div className="flex items-center gap-4">
        <Popover onOpenChange={(open) => { if (open) setHasUnread(false) }}>
          <PopoverTrigger asChild>
            <button className="relative p-2 rounded-full hover:bg-white/5 transition-colors focus:outline-none focus:ring-2 focus:ring-primary">
              <Bell className="w-5 h-5 text-muted-foreground" />
              {hasUnread && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full ring-2 ring-background"></span>
              )}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-80 glass-card border-white/10 mr-4 mt-2" align="end">
            <h4 className="font-semibold mb-3 pb-2 border-b border-white/5">Notifications</h4>
            <div className="space-y-4">
              <div className="flex gap-3 items-start">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">System updated</p>
                  <p className="text-xs text-muted-foreground mt-0.5">The application has been successfully configured and is running.</p>
                  <p className="text-xs text-muted-foreground mt-1">Just now</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Low stock alert</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Some items are running low on inventory. Please check the dashboard.</p>
                  <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  );
}
