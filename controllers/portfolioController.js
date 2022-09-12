const { Users, Portfolio } = require("../models");
const { deleteFile } = require("../middlewares/multerFirebase");

// Admin Privilages
const create = async (req, res, next) => {
  try {
    const results = await Portfolio.create(req.body);
    res.json(results);
  } catch (error) {
    next(error);
  }
};

const findAll = async (req, res, next) => {
  try {
    const results = await Portfolio.findAll();
    res.json(results);
  } catch (error) {
    next(error);
  }
};

const findById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const results = await Portfolio.findByPk(id);
    if (!results) throw new Error("Portfolio not found!", { cause: "NOT_FOUND" });
    res.json(results);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  const { id } = req.params;
  try {
    const results = await Portfolio.update(req.body, { where: { id }, returning: true });
    if (results[0] < 1) throw new Error(`Portfolio with id ${id} not found!`, { cause: "NOT_FOUND" });
    res.json(results[1][0]);
  } catch (error) {
    next(error);
  }
};

const deleteOne = async (req, res, next) => {
  const { id } = req.params;
  try {
    const results = await Portfolio.destroy({ where: { id } });
    if (results < 1) throw new Error(`Portfolio with id ${id} not found!`, { cause: "NOT_FOUND" });
    res.json({ message: "Portfolio deleted successfully", request: id });
  } catch (error) {
    next(error);
  }
};

// User Privilages
const createByUser = async (req, res, next) => {
  const { id } = req.decoded;
  try {
    const checkUser = await Users.findByPk(id);
    if (!checkUser) throw new Error("User not found!", { cause: "NOT_FOUND" });
    const results = await Portfolio.create({
      ...req.body,
      photo: req?.file?.publicUrl,
      photoName: req?.file?.fileRef?.metadata?.name,
      userId: id,
    });
    res.json(results);
  } catch (error) {
    next(error);
  }
};

const findByUser = async (req, res, next) => {
  const { id } = req.decoded;
  try {
    const checkUser = await Users.findByPk(id);
    if (!checkUser) throw new Error("User not found!", { cause: "NOT_FOUND" });
    const results = await Portfolio.findAll({
      include: [{ model: Users, attributes: [], where: { id } }],
    });
    res.json(results);
  } catch (error) {
    next(error);
  }
};

const updateByUser = async (req, res, next) => {
  const { id: userId } = req.decoded;
  const { id: portfolioId } = req.params;
  try {
    const checkUser = await Users.findByPk(userId);
    if (!checkUser) throw new Error("User not found!", { cause: "NOT_FOUND" });
    const getPhoto = await Portfolio.findByPk(portfolioId);
    if (!getPhoto) throw new Error("Portfolio not found!", { cause: "NOT_FOUND" });
    await deleteFile(getPhoto.photoName);
    const results = await Portfolio.update(
      { ...req.body, photo: req?.file?.publicUrl, photoName: req?.file?.fileRef?.metadata?.name, userId },
      { where: { userId, id: portfolioId }, returning: true }
    );
    if (results[0] < 1) throw new Error("Portfolio not found!", { cause: "NOT_FOUND" });
    res.json(results[1][0]);
  } catch (error) {
    next(error);
  }
};

const deleteByUser = async (req, res, next) => {
  const { id: userId } = req.decoded;
  const { id: portfolioId } = req.params;
  try {
    const checkUser = await Users.findByPk(userId);
    if (!checkUser) throw new Error("User not found!", { cause: "NOT_FOUND" });
    const getPhoto = await Portfolio.findByPk(portfolioId);
    if (!getPhoto) throw new Error("Portfolio not found!", { cause: "NOT_FOUND" });
    await deleteFile(getPhoto.photoName);
    await Portfolio.destroy({ where: { userId, id: portfolioId } });
    res.json({ message: "Portfolio deleted successfully", request: portfolioId });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  create,
  findAll,
  findById,
  update,
  deleteOne,
  createByUser,
  findByUser,
  updateByUser,
  deleteByUser,
};
