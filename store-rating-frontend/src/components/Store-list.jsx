import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Search, Star } from "lucide-react";
import { StoreCard } from "./store-card";
import { toast } from "sonner";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";

export function StoreList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [stores, setStores] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    setIsLoading(true);
    try {
      const response = await Axios({
        ...SummaryApi.getAllStores,
      });
      const data = response.data;
      setStores(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load stores. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filter stores based on search term
  const filteredStores = Array.isArray(stores)
    ? stores.filter(
        (store) =>
          store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          store.address.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  // Handle rating submission
  const handleRatingSubmit = async (storeId, rating) => {
    try {
      const response = await Axios({
        ...SummaryApi.submitOrUpdateRating,
        data: {
          id: storeId,
          rating,
        },
      });

      if (response.status !== 200) {
        throw new Error("Failed to submit rating");
      }

      // Update the store in the local state
      setStores(
        stores.map((store) =>
          store.id === storeId
            ? {
                ...store,
                userRating: rating,
                // Update the average rating and total ratings
                // In a real app, you'd get these from the response
                avgRating: store.userRating
                  ? (store.avgRating * store.totalRatings -
                      store.userRating +
                      rating) /
                    store.totalRatings
                  : (store.avgRating * store.totalRatings + rating) /
                    (store.totalRatings + 1),
                totalRatings: store.userRating
                  ? store.totalRatings
                  : store.totalRatings + 1,
              }
            : store
        )
      );

      toast("Rating submitted", {
        description: "Your rating has been submitted successfully.",
      });
    } catch (error) {
      toast("Error", {
        description: "Failed to submit rating. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search by store name or address..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2 mt-2"></div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="h-4 bg-muted rounded w-1/4"></div>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((j) => (
                    <Star key={j} className="h-5 w-5 text-muted" />
                  ))}
                </div>
                <div className="h-4 bg-muted rounded w-1/3"></div>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((j) => (
                    <Star key={j} className="h-5 w-5 text-muted" />
                  ))}
                </div>
                <div className="h-8 bg-muted rounded w-full mt-4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredStores.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredStores.map((store) => (
            <StoreCard
              key={store.id}
              store={store}
              onRatingSubmit={(rating) => handleRatingSubmit(store.id, rating)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-muted-foreground">
            No stores found matching your search criteria.
          </p>
        </div>
      )}
    </div>
  );
}
