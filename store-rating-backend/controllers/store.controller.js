import * as z from "zod";
import { db } from "../index.js";

// GET all stores
export async function getAllStores(req, res) {
  const userId = req.userId;

  console.log("userId08", userId);
  
  try {
    // Get query parameters
    const search = req.query.search || "";
    const sortBy = req.query.sortBy || "name";
    const sortDirection = req.query.sortDirection || "asc";

    // Build filter conditions
    const whereClause = {};

    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { address: { contains: search, mode: "insensitive" } },
      ];
    }

    // Get stores with average rating
    const stores = await db.store.findMany({
      where: whereClause,
      orderBy: {
        [sortBy]: sortDirection,
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        ratings: true,
        _count: {
          select: {
            ratings: true,
          },
        },
      },
    });


    const currentUser = await db.user.findUnique({
        where: {
          id: userId,
        },
      });

    // Calculate average rating for each store
    const storesWithAvgRating = stores.map((store) => {
      const totalRating = store.ratings.reduce(
        (sum, rating) => sum + rating.rating,
        0
      );
      const avgRating =
        store.ratings.length > 0 ? totalRating / store.ratings.length : 0;

      const userRating = currentUser
        ? store.ratings.find((r) => r.userId === currentUser.id)
        : null;

      return {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        owner: store.owner,
        avgRating,
        totalRatings: store._count.ratings,
        userRating: userRating ? userRating.rating : null,
      };
    });

    res.status(200).json(storesWithAvgRating);
  } catch (error) {
    console.error("Error fetching stores:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// POST create a new store (admin only)
const createStoreSchema = z.object({
  name: z
    .string()
    .min(20, "Name must be at least 20 characters")
    .max(60, "Name must not exceed 60 characters"),
  email: z.string().email("Invalid email address"),
  address: z.string().max(400, "Address must not exceed 400 characters"),
  ownerEmail: z.string().email("Invalid owner email address"),
});

export async function createStore(req, res) {
  try {
    const body = req.body;

    // Validate input
    const { name, email, address, ownerEmail } = createStoreSchema.parse(body);

    // Find the owner
    const owner = await db.user.findUnique({
      where: {
        email: ownerEmail,
      },
    });

    if (!owner) {
      return res.status(404).json({ error: "Owner not found" });
    }

    // Update user role to STORE_OWNER if not already
    if (owner.role !== "STORE_OWNER") {
      await db.user.update({
        where: { id: owner.id },
        data: { role: "STORE_OWNER" },
      });
    }

    // Create store
    const store = await db.store.create({
      data: {
        name,
        email,
        address,
        ownerId: owner.id,
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return res.status(201).json(store);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }

    console.error("Error creating store:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

// POST submit or update a rating
const ratingSchema = z.object({
    rating: z.number().int().min(1).max(5),
  });

export async function submitOrUpdateRating(req, res) {
  try {
console.log("req.params.id", req.body.id);

    const storeId = parseInt(req.body.id);
    const userId = req.userId;

    if (isNaN(storeId)) {
        return res.status(400).json({ error: "Invalid store ID" });
      }

    // Check if store exists
    const store = await db.store.findUnique({
        where: {
          id: storeId,
        },
      });


     if (!store) {
      return res.status(404).json({ error: "Store not found" });
    }

    // Validate input
    const { rating } = ratingSchema.parse(req.body);

    // Check if user has already rated this store
    const existingRating = await db.rating.findUnique({
        where: {
          userId_storeId: {
            userId,
            storeId,
          },
        },
      });

    let result

    if (existingRating) {
        result = await db.rating.update({
          where: {
            id: existingRating.id,
          },
          data: {
            rating,
            updatedAt: new Date(),
          },
        });
    } else {
      // Create new rating
      result = await db.rating.create({
        data: {
          userId,
          storeId,
          rating,
        },
      });
    }

    // Calculate new average rating
    const ratings = await db.rating.findMany({
        where: {
          storeId,
        },
      });

      const totalRating = ratings.reduce((sum, r) => sum + r.rating, 0);
      const avgRating = ratings.length > 0 ? totalRating / ratings.length : 0;

      return res.status(200).json({
        rating: result,
        avgRating,
        totalRatings: ratings.length,
      });
  } catch (error) {
    if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }

      console.error("Error submitting rating:", error);
      return res.status(500).json({ error: "Internal Server Error" });
  }
}

// GET store owner dashboard data
export async function getStoreOwnerDashboard(req, res) {
  try {
    const userId = req.userId

    // Get stores owned by the user
    const stores = await db.store.findMany({
        where: {
          ownerId: userId,
        },
        include: {
          ratings: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      });

     if (stores.length === 0) {
      return res.status(200).json({
        stores: [],
        totalRatings: 0,
      });
    }

    // Process store data
    const processedStores = stores.map((store) => {
        const totalRating = store.ratings.reduce((sum, r) => sum + r.rating, 0);
        const avgRating = store.ratings.length > 0 ? totalRating / store.ratings.length : 0;
  
        const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        store.ratings.forEach((r) => {
          ratingDistribution[r.rating]++;
        });
  

        return {
            id: store.id,
            name: store.name,
            email: store.email,
            address: store.address,
            avgRating,
            totalRatings: store.ratings.length,
            ratingDistribution,
            userRatings: store.ratings.map((r) => ({
              id: r.id,
              rating: r.rating,
              createdAt: r.createdAt,
              user: r.user,
            })),
          };
        });
    

    // Calculate total ratings across all stores
    const totalRatings = processedStores.reduce((sum, store) => sum + store.totalRatings, 0);

    return res.status(200).json({
        stores: processedStores,
        totalRatings,
      });
  } catch (error) {
    console.error("Error fetching store dashboard data:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

