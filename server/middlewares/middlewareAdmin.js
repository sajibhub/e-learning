import jwt from "jsonwebtoken";
import fs from "fs/promises";
import path from "path";
import validator from "validator";
import dotenv from "dotenv";

import generateToken from "../utils/jwt.js";

dotenv.config();

const PublicKeyPath = path.join(process.cwd(), "./security/public_key.pem");


const middlewareAdmin = async (req, res, next) => {
  try {
    const { accessTokenAdmin, refreshTokenAdmin } = req.cookies;

    if (!refreshTokenAdmin) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!validator.isJWT(refreshTokenAdmin)) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const publicKey = await fs.readFile(PublicKeyPath, "utf8");
    const verifyToken = (token) => jwt.verify(token, publicKey, { algorithms: ["RS256"] });

    // First try access token
    if (accessTokenAdmin && validator.isJWT(accessTokenAdmin)) {
      try {
        const decodedAccess = verifyToken(accessTokenAdmin);
        req.id = decodedAccess.id; // attach admin ID
        return next();
      } catch (accessErr) {
        if (accessErr.name !== "TokenExpiredError") {
          return res.status(401).json({ message: "Unauthorized" });
        }
      }
    }

    try {
      const decodedRefresh = verifyToken(refreshTokenAdmin);

      const tokens = [
        { name: "accessTokenAdmin", expiresIn: "10d", maxAgeMs: 10 * 24 * 60 * 60 * 1000 },
        { name: "refreshTokenAdmin", expiresIn: "30d", maxAgeMs: 30 * 24 * 60 * 60 * 1000 },
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

      req.id = decodedRefresh.id;
      return next();
    } catch {
      return res.status(401).json({ message: "Unauthorized" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "An error occurred while processing your request.",
    });
  }
};

export default middlewareAdmin;
