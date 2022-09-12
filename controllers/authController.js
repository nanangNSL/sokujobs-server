require("dotenv").config();
const { ACCESS_TOKEN_EXPIRE } = process.env;

const { hashSync, compareSync } = require("bcrypt");
const { Users, Companies, UserProfile, CompanyProfile, Tokens } = require("../models");
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require("../utils/TokenHandling");

// Public Privilages
const register = async (req, res, next) => {
  const { type, password } = req.body;
  try {
    if (!type) throw new Error("User type required!", { cause: "BAD_REQUEST" });
    if (type !== "company") {
      const newUser = { ...req.body, password: hashSync(password, 10) };
      const results = await Users.create(newUser);
      await UserProfile.create({ ...newUser, userId: results.id });
    } else {
      const newUser = { ...req.body, password: hashSync(password, 10) };
      const results = await Users.create(newUser);
      const profile = await CompanyProfile.create({ ...newUser, userId: results.id });
      const getCompany = await Companies.findOne({ where: { name: profile.name } });
      if (getCompany === null) {
        await Companies.create({ name: profile.name, companyProfileId: profile.id });
      } else {
        await Companies.update(
          { name: getCompany.name, companyProfileId: profile.id },
          { where: { name: getCompany.name } }
        );
      }
    }
    res.json({ message: "Register successfully" });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await Users.findOne({ where: { email } });
    if (!user) throw new Error("Invalid email!", { cause: "UNAUTHORIZED" });
    const passwordMatch = compareSync(password, user.password);
    if (!passwordMatch) throw new Error("Invalid password!", { cause: "UNAUTHORIZED" });
    const payload = { id: user.id, name: user.name, email: user.email, type: user.type };
    const accessToken = generateAccessToken(payload);
    await Tokens.create({ userId: payload.id, token: accessToken });
    res.cookie("token", accessToken, { httpOnly: true, ACCESS_TOKEN_EXPIRE }).json({ ...payload, token: accessToken });
  } catch (error) {
    next(error);
  }
};

const refreshToken = async (req, res, next) => {
  const { refreshToken } = req.cookies;
  console.log(refreshToken);
  try {
    if (!refreshToken) throw new Error("Token required!", { cause: "UNAUTHORIZED" });
    const checkToken = await Tokens.findOne({ where: { token: refreshToken } });
    if (!checkToken) throw new Error("Invalid token!", { cause: "UNAUTHORIZED" });
    const decoded = await verifyRefreshToken(refreshToken);
    const payload = { id: decoded.id, name: decoded.name, email: decoded.email, type: decoded.type };
    const newAccessToken = generateAccessToken(payload);
    await Tokens.update({ token: newAccessToken }, { where: { userId: payload.id, token: newAccessToken } });
    res
      .cookie("token", newAccessToken, { httpOnly: true, ACCESS_TOKEN_EXPIRE })
      .json({ ...payload, tokens: newAccessToken });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  refreshToken,
};
