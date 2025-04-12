import * as z from "zod";
import bcryptjs from "bcryptjs";
import { db } from "../index.js";

// GET all users (admin only)
export async function getAllUsersAdmin(req, res) {
  try {
    // Get query parameters
    const search = req.query.search || "";
    const role = req.query.role;
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

    if (role) {
      whereClause.role = role;
    }

    // Get users
    const users = await db.user.findMany({
      where: whereClause,
      orderBy: {
        [sortBy]: sortDirection,
      },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            stores: true,
            ratings: true,
          },
        },
      },
    });

    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// POST create a new user (admin only)
const createUserSchema = z.object({
  name: z
    .string()
    .min(20, "Name must be at least 20 characters")
    .max(60, "Name must not exceed 60 characters"),
  email: z.string().email("Invalid email address"),
  address: z
    .string()
    .min(4, "Address must be at least 4 characters")
    .max(400, "Address must not exceed 400 characters"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(16, "Password must not exceed 16 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must contain at least one special character"
    ),
  role: z.enum(["SYSTEM_ADMIN", "NORMAL_USER", "STORE_OWNER"]),
});

export async function createUserAdmin(req) {
  try {
    const body = req.body;

    // Validate input
    const { name, email, password, address, role } =
      createUserSchema.parse(body);

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return res
        .status(409)
        .json({ error: "User with this email already exists" });
    }

    // Hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Create user
    const newUser = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        address,
        role,
      },
    });

    // Return user without password
    const { password: _, ...userWithoutPassword } = newUser;
    return res.status(201).json(userWithoutPassword);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }

    console.error("Error creating user:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

// GET admin dashboard data
export async function getAdminDashboard(req, res) {
  try {

    // Get counts
    const totalUsers = await db.user.count();
    const totalStores = await db.store.count();
    const totalRatings = await db.rating.count();

    // Get recent users
    const recentUsers = await db.user.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    // Get recent stores
    const recentStores = await db.store.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
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
      },
    });

    // Calculate average rating for each store
    const storesWithAvgRating = recentStores.map((store) => {
      const totalRating = store.ratings.reduce((sum, r) => sum + r.rating, 0);
      const avgRating = store.ratings.length > 0 ? totalRating / store.ratings.length : 0;

      return {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        owner: store.owner,
        avgRating,
        totalRatings: store.ratings.length,
      };
    })

    return res.status(200).json({
      totalUsers,
      totalStores,
      totalRatings,
      recentUsers,
      recentStores: storesWithAvgRating,
    });
  } catch (error) {
    console.error("Error fetching admin dashboard data:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
