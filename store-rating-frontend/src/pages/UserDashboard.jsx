import React, {Suspense} from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button"
import UserLayout from "../components/user-layout";

const UserDashboard = () => {
  return (
    <UserLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Store Listings</h2>
          <div className="flex items-center gap-2">
            <Link to="/user/profile">
              <Button variant="outline">My Profile</Button>
            </Link>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Find and Rate Stores</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>Loading stores...</div>}>
              <StoreList />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </UserLayout>
  );
};

export default UserDashboard;
