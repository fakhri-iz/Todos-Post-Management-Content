import express from "express";
import {
  deleteContent,
  deleteMaterialContent,
  getContentById,
  getContents,
  getPlatforms,
  postContent,
  postMaterialContent,
  updateContent,
  updateMaterialContent,
} from "../controllers/contentControllers.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import multer from "multer";
import { fileFilter, fileStorageContent } from "../utils/multer.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { mutateMaterialContentSchema } from "../utils/schema.js";

const contentRoutes = express.Router();

const upload = multer({
  storage: fileStorageContent,
  fileFilter,
});

contentRoutes.get("/contents", verifyToken, getContents);
contentRoutes.get("/contents/:id", verifyToken, getContentById);
contentRoutes.post(
  "/contents",
  verifyToken,
  upload.single("thumbnail"),
  postContent
);
contentRoutes.put(
  "/contents/:id",
  verifyToken,
  upload.single("thumbnail"),
  updateContent
);
contentRoutes.delete("/contents/:id", verifyToken, deleteContent);

contentRoutes.get("/platforms", verifyToken, getPlatforms);

contentRoutes.post(
  "/contents/materials",
  verifyToken,
  validateRequest(mutateMaterialContentSchema),
  postMaterialContent
);
contentRoutes.put(
  "/contents/materials/:id",
  verifyToken,
  validateRequest(mutateMaterialContentSchema),
  updateMaterialContent
);
contentRoutes.delete(
  "/contents/materials/:id",
  verifyToken,
  deleteMaterialContent
);

export default contentRoutes;
