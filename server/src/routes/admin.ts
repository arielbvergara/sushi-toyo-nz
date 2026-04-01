import { Router, IRouter } from "express";
import rateLimit from "express-rate-limit";
import { authenticate, deleteImage, listImages } from "../controllers/adminController";
import { adminAuth } from "../middleware/adminAuth";
import { readLimiter, writeLimiter } from "../middleware/rateLimit";

const router: IRouter = Router();

const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: "Too many login attempts, please try again later." },
});

router.post("/auth", authLimiter, authenticate);
router.get("/images", adminAuth, readLimiter, listImages);
router.delete("/images/:publicId", adminAuth, writeLimiter, deleteImage);

export default router;
