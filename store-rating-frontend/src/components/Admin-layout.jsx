import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Activity,
  Home,
  LogOut,
  Settings,
  Store,
  User,
  Users,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import SummaryApi from "../common/SummaryApi";
import Axios from "../utils/Axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function AdminLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState();

  const handleLogout = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.logout,
      });

      if (response.data.success) {
        localStorage.clear();
        
        toast(response.data.message);
        
        navigate("/login");
      }
    } catch (error) {
      toast(error.message);
    }
  };

  const fetchUser = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.getUserDetails,
      });

      setUser(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 bg-background border-b">
        <div className="container flex h-16 items-center px-4 sm:px-6 lg:px-8">
          <Link
            to="/admin/dashboard"
            className="flex items-center gap-2 font-semibold"
          >
            <Activity className="h-6 w-6" />
            <span>Store Rating Admin</span>
          </Link>
          <div className="ml-auto flex items-center gap-4">
            {user && (
              <span className="text-sm hidden md:inline-block">
                Hello, {user.name.split(" ")[0]}
              </span>
            )}
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
              <span className="sr-only">Logout</span>
            </Button>
          </div>
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="w-64 border-r bg-muted/40 hidden md:block">
          <nav className="grid gap-2 p-4">
            <Link to="/admin/dashboard">
              <Button
                variant={
                  location.pathname === "/admin/dashboard"
                    ? "secondary"
                    : "ghost"
                }
                className="w-full justify-start"
              >
                <Home className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            <Link to="/admin/users">
              <Button
                variant={
                  location.pathname === "/admin/users" ? "secondary" : "ghost"
                }
                className="w-full justify-start"
              >
                <Users className="mr-2 h-4 w-4" />
                Users
              </Button>
            </Link>
            <Link to="/admin/stores">
              <Button
                variant={
                  location.pathname === "/admin/stores" ? "secondary" : "ghost"
                }
                className="w-full justify-start"
              >
                <Store className="mr-2 h-4 w-4" />
                Stores
              </Button>
            </Link>
            <Link to="/myprofile">
              <Button
                variant={
                  location.pathname === "/myprofile" ? "secondary" : "ghost"
                }
                className="w-full justify-start"
              >
                <User className="mr-2 h-4 w-4" />
                My Profile
              </Button>
            </Link>
            <Link to="/admin/settings">
              <Button
                variant={
                  location.pathname === "/admin/settings"
                    ? "secondary"
                    : "ghost"
                }
                className="w-full justify-start"
              >
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </Link>
          </nav>
        </aside>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
