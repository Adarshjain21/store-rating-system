import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

const Home = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-background border-b">
        <div className="container flex h-16 items-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-lg font-semibold">Store Rating System</h1>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Store Rating Platform
                </h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Rate your favorite stores and help others find the best places
                  to shop.
                </p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Link to="/login">
                  <Button size="lg">Login</Button>
                </Link>
                <Link to="/register">
                  <Button variant="outline" size="lg">
                    Register
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
              <Card>
                <CardHeader>
                  <CardTitle>Normal Users</CardTitle>
                  <CardDescription>
                    Rate stores and manage your profile
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>View all registered stores</li>
                    <li>Search for stores by name and address</li>
                    <li>Submit and modify ratings</li>
                    <li>Update your password</li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link to="/register" className="w-full">
                    <Button className="w-full">Sign Up Now</Button>
                  </Link>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Store Owners</CardTitle>
                  <CardDescription>
                    Manage your store and view ratings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>View users who rated your store</li>
                    <li>See your average store rating</li>
                    <li>Update your password</li>
                    <li>Access your store dashboard</li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link to="/login" className="w-full">
                    <Button className="w-full" variant="outline">
                      Login
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>System Administrators</CardTitle>
                  <CardDescription>Manage the entire platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Add new stores and users</li>
                    <li>View platform statistics</li>
                    <li>Manage all users and stores</li>
                    <li>Apply filters to all listings</li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link to="/login" className="w-full">
                    <Button className="w-full" variant="outline">
                      Admin Login
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-center gap-4 md:h-24">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} Store Rating System. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
