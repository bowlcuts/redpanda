var express = require("express");
var router = express.Router();

const fileUploader = require("../config/cloudinary.config");

const {
  signupGetController,
  signupPostController,
  loginGetController,
  loginPostController,
  uploadGetController,
  uploadPostController,
  videoDeletePost,
  videoGetController,
  homeVidGetController,
  videoPlayerGetController,
  profileGetController,
  contactGetController,
  videoDeletePostController,
  videoEditGetController,
  videoEditPostController
} = require("../controllers/auth.controllers");

const {
  isLoggedIn,
  isAnon,
  isPublic,
  isOwner,
} = require("../middleware/auth.middlewares");

/* GET home page. */
router.get("/", isPublic, function (req, res, next) {
  res.render("index");
});

router.get("/signup", isAnon, signupGetController);

router.post("/signup", isAnon, signupPostController);

router.get("/login", isAnon, loginGetController);

router.post("/login", isAnon, loginPostController);

router.get("/home", isLoggedIn, homeVidGetController);

router.get("/upload", isLoggedIn, uploadGetController);

router.post(
  "/upload",
  isLoggedIn,
  fileUploader.fields([
    { name: 'myVideo', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 }
]),
  uploadPostController
);

router.post('/videos/:id/delete', isOwner, videoDeletePostController);

router.get('/videos/:id/edit-video', isOwner, videoEditGetController);

router.post('/videos/:id/edit-video', isOwner, videoEditPostController);

router.get("/videos", isLoggedIn, videoGetController);

router.get("/video-player/:id", isLoggedIn, videoPlayerGetController);

router.get("/profile", isLoggedIn, profileGetController);

router.get("/contact", contactGetController);


router.get("/logout", isLoggedIn, (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

module.exports = router;
