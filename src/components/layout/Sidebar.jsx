import { NavLink, Link } from "react-router-dom";
import { LayoutDashboard, Package, Users, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Dashboard", path: "/", icon: LayoutDashboard },
  { label: "Products", path: "/products", icon: Package },
  { label: "Customers", path: "/customers", icon: Users },
  { label: "Orders", path: "/orders", icon: ShoppingCart },
];

export default function Sidebar() {
  return (
    <aside className="w-64 glass flex flex-col hidden md:flex border-r border-white/5">
      <div className="p-6">
        <Link to="/" className="block transition-opacity hover:opacity-80">
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-400">
            Nexus Inventory
          </h1>
        </Link>
      </div>
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navLinks.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative overflow-hidden",
                  isActive
                    ? "text-primary bg-primary/10 font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
                  )}
                  <Icon className={cn("w-5 h-5 transition-transform group-hover:scale-110", isActive && "text-primary")} />
                  {link.label}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>
      <div className="p-4 border-t border-white/5">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
            A
          </div>
          <div className="flex flex-col text-sm">
            <span className="font-medium text-foreground">Admin User</span>
            <span className="text-xs text-muted-foreground">System Admin</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
