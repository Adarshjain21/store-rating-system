import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"


export function StoreCard({ store, onRatingSubmit }) {
  const [hoveredRating, setHoveredRating] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Function to render stars based on rating
  const renderStars = (rating, interactive = false) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          className={`h-5 w-5 ${
            i < rating ? "fill-primary text-primary" : "fill-muted text-muted-foreground"
          } ${interactive ? "cursor-pointer transition-colors" : ""}`}
          onMouseEnter={() => interactive && setHoveredRating(i + 1)}
          onMouseLeave={() => interactive && setHoveredRating(null)}
          onClick={() => interactive && handleRatingClick(i + 1)}
        />
      ))
  }

  // Function to handle rating click
  const handleRatingClick = async (rating) => {
    setIsSubmitting(true)
    try {
      await onRatingSubmit(rating)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{store.name}</CardTitle>
        <CardDescription>{store.address}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="text-sm font-medium mb-1">Overall Rating ({store.totalRatings} ratings)</div>
          <div className="flex items-center gap-2">
            <div className="text-lg font-bold">{store.avgRating.toFixed(1)}</div>
            <div className="flex">{renderStars(Math.round(store.avgRating))}</div>
          </div>
        </div>

        <div>
          <div className="text-sm font-medium mb-1">{store.userRating ? "Your Rating" : "Rate this store"}</div>
          <div className="flex items-center gap-2">
            {store.userRating && <div className="text-lg font-bold">{store.userRating.toFixed(0)}</div>}
            <div className="flex">{renderStars(hoveredRating || store.userRating || 0, true)}</div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" className="w-full" disabled={isSubmitting}>
          View Details
        </Button>
      </CardFooter>
    </Card>
  )
}
