import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, LogOut, Settings, Star, Store, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { toast } from "sonner";

const UserLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState()

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
            to="/user/dashboard"
            className="flex items-center gap-2 font-semibold"
          >
            <Star className="h-6 w-6" />
            <span>Store Rating System</span>
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
            <Link to="/user/dashboard">
              <Button
                variant={
                  location.pathname === "/user/dashboard"
                    ? "secondary"
                    : "ghost"
                }
                className="w-full justify-start"
              >
                <Home className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            <Link to="/user/stores">
              <Button
                variant={
                  location.pathname === "/user/stores" ? "secondary" : "ghost"
                }
                className="w-full justify-start"
              >
                <Store className="mr-2 h-4 w-4" />
                Stores
              </Button>
            </Link>
            <Link to="/user/ratings">
              <Button
                variant={
                  location.pathname === "/user/ratings" ? "secondary" : "ghost"
                }
                className="w-full justify-start"
              >
                <Star className="mr-2 h-4 w-4" />
                My Ratings
              </Button>
            </Link>
            <Link to="/myprofile">
              <Button
                variant={
                  location.pathname === "/myProfile" ? "secondary" : "ghost"
                }
                className="w-full justify-start"
              >
                <User className="mr-2 h-4 w-4" />
                My Profile
              </Button>
            </Link>
            <Link to="/user/settings">
              <Button
                variant={
                  location.pathname === "/user/settings" ? "secondary" : "ghost"
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
};

export default UserLayout;
