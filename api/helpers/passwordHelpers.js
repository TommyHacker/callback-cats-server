const bcrypt = require("bcrypt");
const saltRounds = 12;

exports.hashPassword = (password) => {
  // take the password and hash it, then return it.
  return bcrypt.hashSync(password, saltRounds);
};

exports.verifyPassword = async (password, hash) => {
  // hash the password and compare it with the previous hash
  try {
    const verified = await bcrypt.compareSync(password, hash);
    return true;
    // if they are the same, return true, other wise return false
  } catch (err) {
    return "username or password required.";
  }
};
