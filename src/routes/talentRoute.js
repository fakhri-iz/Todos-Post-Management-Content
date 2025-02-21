import express from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
import {
  deleteTalent,
  getTalents,
  postTalent,
  updateTalents,
} from "../controllers/talentController.js";
import { fileFilter, fileStorage } from "../utils/multer.js";
import multer from "multer";

const talentRoutes = express.Router();

const upload = multer({
  storage: fileStorage("talents"),
  fileFilter,
});

talentRoutes.get("/talents", verifyToken, getTalents);
talentRoutes.post("/talents", verifyToken, upload.single("photo"), postTalent);
talentRoutes.put(
  "/talents/:id",
  verifyToken,
  upload.single("photo"),
  updateTalents
);
talentRoutes.delete("/talents/:id", verifyToken, deleteTalent);

export default talentRoutes;
