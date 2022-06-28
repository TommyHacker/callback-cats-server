const jwt = require("jsonwebtoken");

// generate an accesstoken with the users ID if they gave correct password
exports.createToken = async (id) => {
  try {
    const token = await jwt.sign({ id }, process.env.TOKEN_SECRET);
    return token;
  } catch (err) {
    console.log(err);
    return false;
  }
};

// Check to see if the accessToken has been tampered with, return false if it has.
exports.verifyToken = async (token) => {
  try {
    const verified = await jwt.verify(token, secret);
    return true;
  } catch (err) {
    return false;
  }
};

// translate the jsonwebtoken into the users ID if they are verified.
exports.decodeToken = (token) => {
  try {
    const result =  jwt.decode( token , process.env.TOKEN_SECRET).id.toString();

    return result;
  } catch (err) {
    return false;
  }
};
