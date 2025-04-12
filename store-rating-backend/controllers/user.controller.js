import bcryptjs from "bcryptjs";
import { db } from "../index.js";
import generateAccessToken from "../utils/generateAccessToken.js";

export async function registerUserController(req, res) {
  try {
    const { name, email, password, address } = req.body;

    const requiredFields = ["name", "email", "password", "address"];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.json({
        message: `Please provide ${missingFields.join(", ")}.`,
        error: true,
        success: false,
      });
    }

    const existingUser = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return res.json({
        message: "User with this email already exists",
        error: true,
        success: false,
      });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        address,
        role: "NORMAL_USER",
      },
    });

    return res.json({
      message: "User Registered Successfully",
      error: false,
      success: true,
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function loginController(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({
        message: "Provide email and password",
        error: true,
        success: false,
      });
    }

    const user = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.json({
        message: "User not registered",
        error: true,
        success: false,
      });
    }

    const checkPassword = await bcryptjs.compare(password, user.password);

    if (!checkPassword) {
      return res.json({
        message: "Check your password",
        error: true,
        success: false,
      });
    }

    const accessToken = await generateAccessToken(user._id);

    const cookiesOption = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };

    res.cookie("accessToken", accessToken, cookiesOption);

    return res.json({
      message: "Login Successfully",
      error: false,
      success: true,
      data: user,
      accessToken: accessToken
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function logoutController(req, res) {
  try {
    const cookiesOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "None", // Allows cross-site cookies
    };

    // Clear the access token cookie
    res.clearCookie("accessToken", cookiesOptions);

    return res.status(200).json({
      message: "Logged out successfully",
      success: true,
      error: false,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Logout failed",
      success: false,
      error: true,
      details: error.message || error,
    });
  }
}