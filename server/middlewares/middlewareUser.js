import jwt from "jsonwebtoken";
import fs from "fs/promises";
import path from "path";
import validator from "validator";
import dotenv from "dotenv";

import generateToken from "../utils/jwt.js";
import userModel from "../models/userModel.js";

dotenv.config();

const PublicKeyPath = path.join(process.cwd(), "./security/public_key.pem");

// Helper to clear user cookies
const clearUserCookies = (res) => {
  ["accessTokenUser", "refreshTokenUser"].forEach((name) => {
    res.clearCookie(name, { httpOnly: true, secure: true, sameSite: "none", path: "/" });
  });
};

const middlewareUser = async (req, res, next) => {
  try {
    const { accessTokenUser, refreshTokenUser } = req.cookies;

    if (!refreshTokenUser) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (
      (accessTokenUser && !validator.isJWT(accessTokenUser)) ||
      !validator.isJWT(refreshTokenUser)
    ) {
      return res.status(401).json({ message: "Invalid or missing JWT token" });
    }

    const publicKey = await fs.readFile(PublicKeyPath, "utf8");
    const verifyToken = (token) => jwt.verify(token, publicKey, { algorithms: ["RS256"] });

    const checkUserStatus = async (userId) => {
      const user = await userModel.findById(userId).select("status");
      if (!user || !user.status) {
        clearUserCookies(res);
        return res.status(401).json({
          message: "Account disabled. Contact support to restore access.",
        });
      }
      req.userId = userId;
      return next();
    };

    if (accessTokenUser) {
      try {
        const decodedAccess = verifyToken(accessTokenUser);
        return checkUserStatus(decodedAccess.id);
      } catch (accessErr) {
        if (accessErr.name !== "TokenExpiredError") {
          return res.status(401).json({ message: "Unauthorized" });
        }
      }
    }

    try {
      const decodedRefresh = verifyToken(refreshTokenUser);

      const tokens = [
        { name: "accessTokenUser", expiresIn: "10d", maxAgeMs: 10 * 24 * 60 * 60 * 1000 },
        { name: "refreshTokenUser", expiresIn: "30d", maxAgeMs: 30 * 24 * 60 * 60 * 1000 },
      ];

      await Promise.all(
        tokens.map(async ({ name, expiresIn, maxAgeMs }) => {
          const token = await generateToken(decodedRefresh.id, expiresIn);
          res.cookie(name, token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: maxAgeMs,
          });
        })
      );

      return checkUserStatus(decodedRefresh.id);
    } catch {
      clearUserCookies(res);
      return res.status(401).json({ message: "Unauthorized" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "An error occurred while processing your request.",
    });
  }
};

export default middlewareUser;
