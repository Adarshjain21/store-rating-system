import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";

export default function MyProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.getUserDetails,
      });
      console.log("response17", response);
      setUser(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg font-medium">Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <button
        onClick={() => navigate(-1)}
        className="absolute left-4 top-4 md:left-8 md:top-8"
      >
        Back
      </button>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">My Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Full Name
              </label>
              <Input
                placeholder="Enter your name"
                value={user?.name || ""}
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input
                type="email"
                placeholder="john@example.com"
                value={user?.email || ""}
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Address</label>
              <Input
                placeholder="123 Main St, City, Country"
                value={user?.address || ""}
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Role</label>
              <Input
                placeholder="Your role"
                value={user?.role || ""}
                readOnly
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
