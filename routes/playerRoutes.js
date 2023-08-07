import express from "express";
import {
  createPlayer,
  getAllPlayers,
  getPlayerDetails,
  updatePlayer,
} from "../controllers/player/playerController.js";
import multer from "multer";

const upload = multer();
const router = express.Router();

router.post("/create-player", upload.single('image'), createPlayer);

router.put("/update-player/:id", upload.single('image'), updatePlayer);

router.get('/:id', getPlayerDetails)

router.get('/list/:branchYear', getAllPlayers)

export default router;
