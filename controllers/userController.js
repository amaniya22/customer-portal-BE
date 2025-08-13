import { query } from "../config/db.js";
import bcrypt from "bcryptjs";
import {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "../utils/jwt.js";
import dotenv from "dotenv";

dotenv.config();

const REFRESH_COOKIE_NAME = "cookie";

const cookieOptions = {
  httpOnly: true,
  secure: "production",
  sameSite: "lax",
  path: "/api/auth",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

// Standardized response handler function
const handleResponse = (res, status, message, data = null) => {
  res.status(status).json({
    status,
    message,
    data,
  });
};

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await query(`SELECT * FROM public."userTable"`);
    handleResponse(res, 200, "Users fetched successfully", users);
  } catch (err) {
    next(err);
  }
};

export const addUser = async (req, res) => {
  // passing the payload into the request body
  const { username, user_fname, user_lname, user_email, user_pass, user_role } =
    req.body;

  // Check if all the fields are filled
  if (!username || !user_email || !user_pass || !user_fname || !user_lname) {
    handleResponse(res, 400, "Missing fields");
  }

  try {
    // Checking if their is an existing user by comparing the username and user_email of the user in the req.body
    const existingUser = await query(
      `SELECT user_id FROM public."userTable" WHERE user_email = $1 OR username = $2`,
      [user_email, username]
    );

    if (existingUser.rows.length) {
      handleResponse(res, 409, "Email or Username already in use");
    }

    // hash the password
    const hashedPassword = await bcrypt.hash(user_pass, 10);
    const role = user_role && user_role === "admin" ? "admin" : "customer";

    const regUser = await query(
      `INSERT INTO public."userTable"(
	username, user_fname, user_lname, user_email, user_pass, user_role)
	VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`,
      [username, user_fname, user_lname, user_email, hashedPassword, role]
    );

    const user = regUser.rows[0];

    // generate Tokens
    const accessToken = signAccessToken({
      user_id: user.user_id,
      user_role: user.user_role,
    });
    const refreshToken = signRefreshToken({ user_id: user.user_id });

    // hashed refresh token
    const refreshHashed = await bcrypt.hash(refreshToken, 10);
    await query(
      `UPDATE public."userTable" SET refresh_token_hash = $1 WHERE user_id = $2 RETURNING *`,
      [refreshHashed, user.user_id]
    );

    // set httpOnly cookie containing raw refresh token
    res.cookie(REFRESH_COOKIE_NAME, refreshToken, cookieOptions);
    return res.status(200).json({
      accessToken, // JWT access token
      user: {
        user_id: user.user_id,
        username: user.username,
        user_fname: user.user_fname,
        user_lname: user.user_lname,
        user_email: user.user_email,
        user_role: user.user_role,
      },
    });
  } catch (err) {
    console.error(err);
    handleResponse(res, 500, "Server error");
  }
};

export const logUser = async (req, res) => {
  const { username, password } = req.body;
  console.log(req.body)

  // Check if all the fields are filled
  if (!username || !password) {
    handleResponse(res, 400, "Missing fields");
  }

  try {
    const loggedUser = await query(
      `SELECT * FROM public."userTable" WHERE username=$1`,
      [username]
    );

    const user = loggedUser.rows[0];
    if (!user || (!await bcrypt.compare(password, user.user_pass))) {
      handleResponse(res, 401, "Invalid credentials");
    }

    // generate Tokens
    const accessToken = signAccessToken({
      user_id: user.user_id,
      user_role: user.user_role,
    });
    const refreshToken = signRefreshToken({ user_id: user.user_id });

    // hashed refresh token
    const refreshHashed = await bcrypt.hash(refreshToken, 10);
    await query(
      `UPDATE public."userTable" SET refresh_token_hash = $1 WHERE user_id = $2`,
      [refreshHashed, user.user_id]
    );

    // set httpOnly cookie containing raw refresh token
    res.cookie(REFRESH_COOKIE_NAME, refreshToken, cookieOptions);

    return res.json({
      user: {
        user_id: user.user_id,
        username: user.username,
        user_fname: user.user_fname,
        user_lname: user.user_lname,
        user_email: user.user_email,
        user_role: user.user_role,
        refresh_token_hash: user.refresh_token_hash,
      },
      accessToken,
    });
  } catch (err) {
    handleResponse(res, 500, "Server error");
  }
};

export const refreshAuth = async (req, res) => {
  try {
    const token = req.cookies[REFRESH_COOKIE_NAME];
    // If the token from the cookies is not valid
    if (!token) {
      handleResponse(res, 401, "No refresh token");
    }

    let payload;
    try {
      payload = verifyRefreshToken(token); //set payload to whether the token is valid or expired
    } catch (err) {
      handleResponse(res, 401, "Invalid refresh token");
    }

    const userResponse = await query(
      `SELECT user_id, user_role, refresh_token_hash FROM public."userTable" WHERE user_id=$1`,
      [payload.user_id]
    );
    const user = userResponse.rows[0];
    if (!user || !user.refresh_token_hash) {
      handleResponse(res, 401, "Refresh token not recognized");
    }

    // verify token against stored hash token
    const tokenValid = await bcrypt.compare(token, user.refresh_token_hash);
    if (!tokenValid) {
      // Update to avoid token leak
      await query(
        `UPDATE public."userTable" SET refresh_token_hash = NULL WHERE user_id = $1`,
        [payload.userId]
      );
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    // generate Tokens
    const newAccessToken = signAccessToken({
      user_id: user.user_id,
      user_role: user.user_role,
    });
    const newRefreshToken = signRefreshToken({ user_id: user.user_id });

    // hashed refresh token
    const newRefreshHashed = await bcrypt.hash(newRefreshToken, 10);
    await query(
      `UPDATE public."userTable" SET refresh_token_hash = $1 WHERE user_id = $2`,
      [newRefreshHashed, user.user_id]
    );

    // set new cookie
    res.cookie(REFRESH_COOKIE_NAME, newRefreshToken, cookieOptions);

    // return new access token and basic user info
    return res.json({
      accessToken: newAccessToken,
      user: { user_id: user.user_id, user_role: user.user_role },
    });
  } catch (err) {
    handleResponse(res, 500, "Server error");
  }
};

export const logOutUser = async (req, res) => {
  try {
    const token = req.cookies[REFRESH_COOKIE_NAME];

    if (token) {
      try {
        const payload = verifyRefreshToken(token);
        await query(
          `UPDATE public."userTable" SET refresh_token_hash = NULL WHERE user_id = $1`,
          [payload.userId]
        );
      } catch (err) {}
    }

    res.clearCookie(REFRESH_COOKIE_NAME, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/api/auth",
    });
    return res.json({ message: "Logged out" });
  } catch (err) {
    handleResponse(res, 500, "Server error");
  }
};
