const User = require("../models/User.model");
const bcryptjs = require("bcryptjs");
const Video = require("../models/Video.model");
const saltRounds = 10;

const signupGetController = (req, res, next) => {
  res.render("signup.hbs");
};

const signupPostController = (req, res, next) => {
  // console.log(req.body);
  if (!req.body.email || !req.body.password || !req.body.userName) {
    res.render("signup", { errorMessage: "sorry you forgot something" });
    return;
  }
  User.findOne({ email: req.body.email })
    .then((foundUser) => {
      if (foundUser) {
        res.render("signup", { errorMessage: "user already exists" });
        return;
      }
      const salt = bcryptjs.genSaltSync(saltRounds);
      const myHashedPassword = bcryptjs.hashSync(req.body.password, salt);

      return User.create({
        email: req.body.email,
        password: myHashedPassword,
        userName: req.body.userName,
      });
    })

    .then((createdUser) => {
      res.redirect("/login");
    })
    .catch((err) => {
      res.send(err);
    });
};

const loginGetController = (req, res, next) => {
  // console.log(req.body);
  res.render("login.hbs");
};

const loginPostController = (req, res, next) => {
  // console.log(req.body);

  const { email, password } = req.body;

  if (!email || !password) {
    res.render("login.hbs", { errorMessage: "Forgot email or password" });
    return;
  }

  User.findOne({ email })
    .then((foundUser) => {
      // console.log(foundUser);
      if (!foundUser) {
        // res.send('Sorry user does not exist');
        res.render("login.hbs", { errorMessage: "Sorry user does not exist" });
        return;
      }
      const isValidPassword = bcryptjs.compareSync(
        password,
        foundUser.password
      );

      if (!isValidPassword) {
        // res.send('Sorry wrong password');
        res.render("login.hbs", { errorMessage: "Sorry wrong password" });
        return;
      }

      req.session.user = foundUser;
      // console.log(req.session);
      res.redirect("/home");
    })
    .catch((err) => {
      // console.log(err);
      res.send(err);
    });
};
const homeVidGetController = (req, res, next) => {
  // console.log("hey");

  Video.find({})
    .then((foundVideos) => {
      // console.log(foundVideos[0].image);
      res.render("index.hbs", { video: foundVideos[0].image });
    })
    .catch((err) => console.log(err));
};

const videoGetController = (req, res, next) => {
  // console.log("hey");

  Video.find({}).populate('owner')
    .then((foundVideos) => {
      // console.log(foundVideos);
      res.render("videos.hbs", { videos: foundVideos });
    })
    .catch((err) => console.log(err));
  
};

const uploadGetController = (req, res, next) => {
  res.render("upload.hbs");
};

const uploadPostController = (req, res, next) => {
  // console.log(req.files);

  let currentDate = new Date();
  const options = {
    // weekday: "long",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  };
  // console.log(currentDate.toLocaleString("en-US", options));
  
  Video.create({
    title: req.body.title,
    description: req.body.description,
    owner: req.session.user._id,
    image: req.files.myVideo[0].path,
    thumbnail: req.files.thumbnail[0].path,
    date: currentDate.toLocaleString("en-US", options),
    reviews: req.body.reviews
  })
    .then((uploadedVideo) => {
      console.log(uploadedVideo);
      // res.send(uploadedVideo);
      res.redirect("/videos");
    })
    .catch((err) => console.log(`Error while trying to upload video: ${err}`));
};

const videoPlayerGetController = (req, res, next) => {
  Video.findById(req.params.id).populate('reviews')
  .then((foundVideo) => {
    console.log(foundVideo)
    res.render('videoplayer.hbs', foundVideo);
  })
  .catch((err) => {
    console.log(err)
  });
  
};

const videoDeletePostController = (req, res, next) => {
  // console.log('id of Video', req.params.id)
  Video.findById(req.params.id)
  .then((foundVideo) => {
      foundVideo.delete()
      // console.log('Video was deleted', foundVideo);
      res.redirect('/videos')
  })
  .catch(err => console.log('error while deleting: ', err));

};

const videoEditGetController = (req, res, next) => {
  Video.findById(req.params.id)
  .then((foundVideo) => {
      res.render('edit-video.hbs', foundVideo)
  })
  .catch((err) => {
      console.log(err)
  });
};

const videoEditPostController = (req, res, next) => {
  Video.findByIdAndUpdate(req.params.id, {
    title: req.body.title,
    description: req.body.description,
    // image: req.files.myVideo[0].path,
    // thumbnail: req.files.thumbnail[0].path
},
{new: true}
)
.then((updatedVideo) => {
    // console.log("Changed Video:", updatedVideo)
    res.redirect('/videos')
})
.catch((err) => console.log(err))
};

const profileGetController = (req, res, next) => {
  User.findById(req.session.user._id)
  .then((foundUser) => {
    // console.log(foundUser)
    res.render('profile.hbs', foundUser);
  })
  .catch((err) => {
    console.log(err);
  });
};

const contactGetController = (req, res, next) => {
  res.render('contact.hbs')
};

module.exports = {
  signupGetController,
  signupPostController,
  loginGetController,
  loginPostController,
  homeVidGetController,
  uploadGetController,
  uploadPostController,
  videoGetController,
  videoDeletePostController,
  videoEditGetController,
  videoEditPostController,
  videoPlayerGetController,
  profileGetController,
  contactGetController
};
