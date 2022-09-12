const { Users, UserProfile, CompanyProfile, Companies } = require("../models");
const { deleteFile } = require("../middlewares/multerFirebase");

const postProfilePhoto = async (req, res, next) => {
  const { id: userId, type } = req.decoded;
  try {
    const checkUser = await Users.findByPk(userId);
    if (!checkUser) throw new Error("User not found!", { cause: "NOT_FOUND" });
    if (type !== "company") {
      const results = await UserProfile.update(
        { photo: req?.file?.publicUrl, photoName: req?.file?.fileRef?.metadata?.name },
        { where: { userId }, returning: true }
      );
      res.json(results[1][0]);
    } else {
      const results = await CompanyProfile.update(
        { photo: req?.file?.publicUrl, photoName: req?.file?.fileRef?.metadata?.name },
        { where: { userId }, returning: true }
      );
      await Companies.update(
        { photo: results[1][0].photo, photoName: results[1][0].photoName },
        { where: { companyProfileId: results[1][0].id } }
      );
      res.json(results[1][0]);
    }
  } catch (error) {
    next(error);
  }
};

const deleteProfilePhoto = async (req, res, next) => {
  const { id: userId, type } = req.decoded;
  try {
    const checkUser = await Users.findByPk(userId);
    if (!checkUser) throw new Error("User not found!", { cause: "NOT_FOUND" });
    if (type !== "company") {
      const getPhoto = await UserProfile.findOne({ where: { userId } });
      await deleteFile(getPhoto.photoName);
      await UserProfile.update({ photo: null, photoName: null }, { where: { userId }, returning: true });
    } else {
      const getPhoto = await CompanyProfile.findOne({ where: { userId } });
      await deleteFile(getPhoto.photoName);
      const getProfile = await CompanyProfile.update(
        { photo: null, photoName: null },
        { where: { userId }, returning: true }
      );
      await Companies.update({ photo: null, photoName: null }, { where: { companyProfileId: getProfile[1][0].id } });
    }
    res.json({ message: "Delete profile photo successfully!" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  postProfilePhoto,
  deleteProfilePhoto,
};
