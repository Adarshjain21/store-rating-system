import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"
import { toast } from "sonner"
import Axios from "../utils/Axios"
import SummaryApi from "../common/SummaryApi"

export function StoreDashboardContent() {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Axios({
            ...SummaryApi.getStoreDashboard
        })
        setData(response.data)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load store data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Function to render stars based on rating
  const renderStars = (rating) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < rating ? "fill-primary text-primary" : "fill-muted text-muted-foreground"}`}
        />
      ))
  }

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-20 bg-muted rounded"></div>
        <div className="h-40 bg-muted rounded"></div>
      </div>
    )
  }

  if (!data || data.stores.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No store data available. You don't have any stores assigned to you.</p>
      </div>
    )
  }

  // For simplicity, we'll just show the first store
  const store = data.stores[0]

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-4">
          <div>
            <h3 className="font-medium">Store Name</h3>
            <p>{store.name}</p>
          </div>
          <div>
            <h3 className="font-medium">Email</h3>
            <p>{store.email}</p>
          </div>
          <div>
            <h3 className="font-medium">Address</h3>
            <p>{store.address}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="text-4xl font-bold">{store.avgRating.toFixed(1)}</div>
            <div className="flex">{renderStars(Math.round(store.avgRating))}</div>
          </div>
          <div>
            <h3 className="font-medium">Total Ratings</h3>
            <p>{store.totalRatings} ratings submitted</p>
          </div>
          <div>
            <h3 className="font-medium">Rating Distribution</h3>
            <div className="flex items-center gap-2">
              <Badge variant="outline">5★: {store.ratingDistribution[5]}</Badge>
              <Badge variant="outline">4★: {store.ratingDistribution[4]}</Badge>
              <Badge variant="outline">3★: {store.ratingDistribution[3]}</Badge>
              <Badge variant="outline">2★: {store.ratingDistribution[2]}</Badge>
              <Badge variant="outline">1★: {store.ratingDistribution[1]}</Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">User Ratings</h3>
        {store.userRatings.length > 0 ? (
          <div className="space-y-4">
            {store.userRatings.map((rating) => (
              <div key={rating.id} className="flex items-start gap-4 p-4 border rounded-lg">
                <Avatar>
                  <AvatarImage src={`/placeholder.svg?height=40&width=40`} alt={rating.user.name} />
                  <AvatarFallback>
                    {rating.user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{rating.user.name}</h3>
                    <span className="text-sm text-muted-foreground">
                      {new Date(rating.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{rating.user.email}</p>
                  <div className="flex mt-2">{renderStars(rating.rating)}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-muted-foreground">No ratings have been submitted for this store yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
