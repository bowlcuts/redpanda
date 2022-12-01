const isLoggedIn = (req, res, next) => {
  // console.log('hi')
  if (!req.session.user) {
    req.app.locals.isLoggedIn = true;
    res.redirect("/");
    return;
  }
  req.app.locals.isLoggedIn = true;
  next();
};

const isAnon = (req, res, next) => {
  // console.log('hi')
  if (req.session.user) {
    req.app.locals.isLoggedIn = true;
    res.redirect("/");
    return;
  }
  req.app.locals.isLoggedIn = false;
  next();
};

const isPublic = (req, res, next) => {
  if (req.session.user) {
    req.app.locals.isLoggedIn = true;
  } else {
    req.app.locals.isLoggedIn = false;
  }
  next();
};

const Video = require('../models/Video.model')

  const isOwner = (req, res, next) => {
    Video.findById(req.params.id)
    .then((foundVideo) => {
        if (String(foundVideo.owner) === req.session.user._id) {
            next()
        } else {
            res.render('videos.hbs', {errorMessage: "You don't have permission."})
            
        }
    })
    .catch((err) => {
        console.log(err)
    })
}

const isNotOwner = (req, res, next) => {
    Video.findById(req.params.id)
    .then((foundVideo) => {
        if (String(foundVideo.owner) !== req.session.user._id) {
            next()
        } else {
            res.render('videos.hbs', {errorMessage: "You don't have permission."})
        }
    })
    .catch((err) => {
        console.log(err)
    })
}

module.exports = {
  isLoggedIn,
  isAnon,
  isPublic,
  isOwner,
  isNotOwner
};
