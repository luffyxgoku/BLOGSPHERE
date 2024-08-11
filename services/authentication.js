const JWT = require("jsonwebtoken");

const secretKey = "786";

function createTokenForUser(user) {
  const payload = {
    _id: user._id,
    email: user.email,
    profileImageUrl: user.profileImageUrl,
    role: user.role,
  };
  const token = JWT.sign(payload, secretKey);
  return token;
}

function validateTokenOfUser(token) {
  const payload = JWT.verify(token, secretKey);
  return payload;
}

module.exports = {
  createTokenForUser,
  validateTokenOfUser,
};
