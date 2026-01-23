import express from "express";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import hpp from "hpp";
import dotenv from "dotenv";
import compression from "compression";
import mongoSanitize from 'express-mongo-sanitize';
import cors from "cors";
import path from "path";

import GenerateKeyPair from "./utils/generateKeyPair.js";
import { redisConnection } from "./config/redis.js";
import database from "./config/database.js";
import mainRouter from "./router/mainRouter.js";
import adminModel from "./models/adminModel.js";

dotenv.config();
const PORT = process.env.PORT || 4000;
const app = express();


// Rate limit
const limit = rateLimit({
  windowMs: parseInt(process.env.REQ_MS, 10),
  max: parseInt(process.env.REQ_LIMIT, 10),
  message: "Too many requests, please try again later.",
  statusCode: 429,
});
app.use(limit);

const allowedOrigins = process.env.FRONTEND_URLS.split(",");
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// Helmet (security headers)
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  noSniff: true,
}));
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    imgSrc: ["'self'", 'data:', 'https:', 'blob:'],
    scriptSrc: ["'self'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    objectSrc: ["'none'"],
    upgradeInsecureRequests: [],
  },
}));

// Middlewares
app.use(cookieParser());
app.use(hpp());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use((req, res, next) => {
  ['body', 'query', 'params'].forEach((key) => {
    if (req[key]) {
      const sanitized = mongoSanitize(req[key]);
      req[`sanitized${key.charAt(0).toUpperCase() + key.slice(1)}`] = sanitized;
    }
  });
  next();
});

// Routes
app.use('/api/v1', mainRouter);
app.use("/images", express.static(path.join(process.cwd(), "images")));
app.use("/files", express.static(path.join(process.cwd(), "files")));

(async () => {
  try {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT} (PID: ${process.pid})`);
    });
    await GenerateKeyPair();
    await database();
    await redisConnection();

  } catch (error) {
    console.log(error);
    process.exit(1);
  }
})();