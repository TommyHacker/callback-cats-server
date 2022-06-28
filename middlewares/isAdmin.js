exports.isAdmin = (req, res, next) => {
  if (!res.locals.currentUser.isAdmin)
    return res.status(500).json({ message: "not allowed." });
  next();
};
