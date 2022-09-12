const { hashSync } = require("bcrypt");
const { Users, UserProfile, Companies, CompanyProfile, Skills, Portfolio } = require("../models");

// User Privilages
const getProfile = async (req, res, next) => {
  const { type, id } = req.decoded;
  try {
    const checkUser = await Users.findByPk(id);
    if (!checkUser) throw new Error("User not found!", { cause: "NOT_FOUND" });
    if (type !== "company") {
      const results = await Users.findByPk(id, {
        include: [UserProfile, { model: Skills, through: { attributes: [] } }, Companies, Portfolio],
      });
      if (!results) throw new Error("User not found!", { cause: "NOT_FOUND" });
      res.json(results);
    } else {
      const results = await Users.findByPk(id, { include: [CompanyProfile] });
      if (!results) throw new Error("Company not found!", { cause: "NOT_FOUND" });
      res.json(results);
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  const { type, id } = req.decoded;
  const { password } = req.body;
  try {
    const checkUser = await Users.findByPk(id);
    if (!checkUser) throw new Error("User not found!", { cause: "NOT_FOUND" });
    if (type !== "company") {
      const newData = password ? { ...req.body, password: hashSync(password, 10) } : { ...req.body };
      await Users.update(newData, { where: { id } });
      await UserProfile.update(newData, { where: { userId: id } });
      res.json({ message: "Profile updated successfully", request: req.body });
    } else {
      const newData = password ? { ...req.body, password: hashSync(password, 10) } : { ...req.body };
      await Users.update(newData, { where: { id } });
      const getProfile = await CompanyProfile.update(newData, { where: { userId: id }, returning: true });
      const dataProfile = getProfile[1][0];
      await Companies.update(
        { name: dataProfile.name, photo: dataProfile.photo },
        { where: { companyProfileId: dataProfile.id } }
      );
      res.json({ message: "Profile updated successfully", request: req.body });
    }
  } catch (error) {
    next(error);
  }
};

const deleteProfile = async (req, res, next) => {
  const { id } = req.decoded;
  try {
    const results = await Users.destroy({ where: { id } });
    if (results < 1) throw new Error("Users not found!", { cause: "NOT_FOUND" });
    res.json({ message: "Account deleted successfully", request: id });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  deleteProfile,
};
