require("dotenv").config();
const { ACCESS_TOKEN_SECRET, ACCESS_TOKEN_EXPIRE, REFRESH_TOKEN_SECRET, REFRESH_TOKEN_EXPIRE } = process.env;

const jwt = require("jsonwebtoken");
const { Token } = "../models";

exports.generateAccessToken = (payload) => {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRE });
};

exports.generateRefreshToken = (payload) => {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRE });
};

exports.verifyAccessToken = (token) => {
  return new Promise((resolve, reject) => {
    try {
      const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
      resolve(decoded);
    } catch (err) {
      reject(new Error("Invalid token!", { cause: "FORBIDDEN" }));
    }
  });
};

exports.verifyRefreshToken = (token) => {
  return new Promise((resolve, reject) => {
    try {
      const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET);
      resolve(decoded);
    } catch (err) {
      reject(new Error("Invalid token!", { cause: "FORBIDDEN" }));
    }
  });
};
