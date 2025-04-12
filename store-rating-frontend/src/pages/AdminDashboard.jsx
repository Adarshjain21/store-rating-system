import { Suspense } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminLayout } from "../components/Admin-layout";
import { AdminDashboardStats } from "../components/Admin-dashboard-stats";
import { UserList } from "../components/User-list";
import { StoreList } from "../components/Store-list";
import { AddUserForm } from "../components/Add-user-form";
import { AddStoreForm } from "../components/Add-store-form";

export default function AdminDashboard() {

  return (
    <AdminLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
          <div className="flex items-center gap-2">
            <Link to="/myProfile">
              <Button variant="outline">My Profile</Button>
            </Link>
          </div>
        </div>

        <Tabs defaultValue="overview">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="stores">Stores</TabsTrigger>
            <TabsTrigger value="add-user">Add User</TabsTrigger>
            <TabsTrigger value="add-store">Add Store</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Suspense fallback={<div>Loading dashboard stats...</div>}>
              <AdminDashboardStats />
            </Suspense>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>All Users</CardTitle>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<div>Loading users...</div>}>
                  <UserList />
                </Suspense>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stores">
            <Card>
              <CardHeader>
                <CardTitle>All Stores</CardTitle>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<div>Loading stores...</div>}>
                  <StoreList />
                </Suspense>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="add-user">
            <Card>
              <CardHeader>
                <CardTitle>Add New User</CardTitle>
              </CardHeader>
              <CardContent>
                <AddUserForm />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="add-store">
            <Card>
              <CardHeader>
                <CardTitle>Add New Store</CardTitle>
              </CardHeader>
              <CardContent>
                <AddStoreForm />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
