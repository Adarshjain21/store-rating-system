import { Suspense } from "react"
import {Link} from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StoreLayout } from "../components/Store-layout"
import { StoreDashboardContent } from "../components/Store-dashboard-content"

export default function StoreDashboard() {

  return (
    <StoreLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Store Dashboard</h2>
          <div className="flex items-center gap-2">
            <Link to="/myProfile">
              <Button variant="outline">My Profile</Button>
            </Link>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Store Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>Loading store data...</div>}>
              <StoreDashboardContent />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </StoreLayout>
  )
}
