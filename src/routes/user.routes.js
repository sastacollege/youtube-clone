import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT as authorization } from "./../middlewares/auth.middleware.js";
let router = Router();

import {
  registerUser,
  loginUser,
  logoutUser,
  tokenRefreshing,
  currentUser,
  changePassword,
  updateAccDetail,
  updateAvatarImage,
  updateCoverImage,
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
router.route("/currentuser").get(authorization, currentUser);
router
  .route("/changepassword")
  .post(upload.none(), authorization, changePassword);
router
  .route("/update-account-detail")
  .post(upload.none(), authorization, updateAccDetail);
router
  .route("/update-avatar")
  .post(authorization, upload.single("avatar"), updateAvatarImage);
router
  .route("/update-coverImage")
  .post(authorization, upload.single("coverImage"), updateCoverImage);

export default router;
