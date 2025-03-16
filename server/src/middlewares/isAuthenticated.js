const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) {
    return next(); //pass control to the next middleware
  }
  res.status(401).send({ message: "You must be logged in to access this" });
};

module.exports = isAuthenticated;
