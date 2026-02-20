import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut } from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user) return null;

  return (
    <nav className="w-full bg-[hsl(var(--nav))] border-b border-border px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <Link
          to="/interview"
          className={`text-sm font-medium transition-colors ${
            location.pathname === "/interview"
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Interview
        </Link>
        {user.role === "admin" && (
          <Link
            to="/admin"
            className={`text-sm font-medium transition-colors ${
              location.pathname === "/admin"
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Admin
          </Link>
        )}
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground">
          Welcome, {user.username}
        </span>
        <button
          onClick={logout}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
