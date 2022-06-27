const jwt = require("jsonwebtoken");
const secret = process.env.TOKEN_SECRET;

// generate an accesstoken with the users ID if they gave correct password
exports.createToken = (id) => {
  try {
    const token = jwt.sign(id, secret);
    return token;
  } catch (err) {
    console.log(err);
    return false;
  }
};

// Check to see if the accessToken has been tampered with, return false if it has.
exports.verifyToken = (token) => {
  try {
    const verified = jwt.verify(token, secret);
    return true;
  } catch (err) {
    return false;
  }
};

// translate the jsonwebtoken into the users ID if they are verified.
exports.decodeToken = (token) => {
  try {
    const result = jwt.decode(token, secret);
    return result.id;
  } catch (err) {
    return false;
  }
};
