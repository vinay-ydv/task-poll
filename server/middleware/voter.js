const { v4: uuid } = require("uuid");

module.exports = (req, res, next) => {
  if (!req.cookies.voterId) {
    res.cookie("voterId", uuid(), {
  httpOnly: true,
  sameSite: "none",
  secure: true
});

  }
  next();
};
