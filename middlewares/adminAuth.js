const logged = (req, res, next) => {
  if (req.session.user != undefined) {
    next();
    return true;
  } else {
    res.redirect("/error");
    return false;
  }
};

module.exports = logged;
