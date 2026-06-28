import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { BlacklistToken } from "../models/blacklist.model.js";

/**
 * @name registerController
 * @description Register a new user, expects username, email and password in request body
 * @access Public
 */
export async function registerController(req, res) {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email, username, and password",
      });
    }

    // check if user already exists in db
    const isUserAlreadyExists = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (isUserAlreadyExists) {
      return res.status(400).json({
        success: false,
        message: "User with given username or email already exists",
      });
    }

    // from bcryptjs docs https://github.com/dcodeIO/bcrypt.js
    // hash the password before saving
    const hash = await bcrypt.hash(password, 10);

    // create new user with hashed password
    const newUser = await User.create({
      username,
      email,
      password: hash,
    });

    // generate a token for the new user
    const token = jwt.sign(
      {
        id: newUser._id,
        username: newUser.username,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    // set the token in cookie
    res.cookie("token", token);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Failed to create new user", error);
    res.status(500).json({
      success: false,
      message: "Failed to create new user",
    });
  }
}

/**
 * @name loginUserController
 * @description Login a new user, expects email and password in request body
 * @access Public
 */
export async function loginUserController(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide both email and password",
      });
    }

    // check if user exists in db
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User with given email doesn't exist",
      });
    }

    // compare given password with stored hashed password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    }

    // generate a token for the user
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    // set the token in cookie
    res.cookie("token", token);

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Failed to login", error);
    res.status(500).json({
      success: false,
      message: "Failed to login",
    });
  }
}

export async function logoutUserController(req, res) {
  try {
    const token = req.cookies.token;

    if (token) {
      await BlacklistToken.create({
        token,
      });
    }

    res.clearCookie("token");

    res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    console.error("An error occured during logout", error);
    res.status(500).json({
      success: false,
      message: "An error occured during logout",
    });
  }
}

export async function getMeController(req, res) {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      message: "User details fetched successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to get user",
    });
  }
}
