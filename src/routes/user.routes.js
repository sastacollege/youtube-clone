import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT as authorization } from "./../middlewares/auth.middleware.js";
let router = Router();

import {
  registerUser,
  loginUser,
  logoutUser,
  tokenRefreshing,
} from "./../controllers/user.controller.js";

router.route("/register").post(
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  registerUser,
);

router.route("/login").post(upload.none(), loginUser);
router.route("/logout").post(authorization, logoutUser);
router.route("/tokenrefreshing").post(tokenRefreshing);

export default router;
