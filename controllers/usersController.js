const { Op } = require("sequelize");
const { hashSync } = require("bcrypt");
const { Users, UserProfile, Skills, Companies, Portfolio } = require("../models");
const { getPagination, getPagingData, getSort } = require("../utils/SearchPagination");

// Admin Privilages
const create = async (req, res, next) => {
  const { password } = req.body;
  try {
    const newUser = { ...req.body, password: hashSync(password, 10) };
    const results = await Users.create(newUser);
    res.json(results);
  } catch (error) {
    next(error);
  }
};

const findAll = async (req, res, next) => {
  try {
    const results = await Users.findAll();
    res.json(results);
  } catch (error) {
    next(error);
  }
};

const findById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const results = await Users.findByPk(id, { include: [UserProfile, Skills, Companies, Portfolio] });
    if (!results) throw new Error("User not found!", { cause: "NOT_FOUND" });
    res.json(results);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  const { id } = req.params;
  const { password } = req.body;
  try {
    const updateUser = password ? { ...req.body, password: hashSync(password, 10) } : { ...req.body };
    const results = await Users.update(updateUser, { where: { id }, returning: true });
    if (results[0] < 1) throw new Error(`User with id ${id} not found!`, { cause: "NOT_FOUND" });
    res.json(results[1][0]);
  } catch (error) {
    next(error);
  }
};

const deleteOne = async (req, res, next) => {
  const { id } = req.params;
  try {
    const results = await Users.destroy({ where: { id } });
    if (results < 1) throw new Error(`User with id ${id} not found!`, { cause: "NOT_FOUND" });
    res.json({ message: "User deleted successfully", request: id });
  } catch (error) {
    next(error);
  }
};

// Recuiters Privilages
const findAllByRecuiter = async (req, res, next) => {
  const { page, size, search, sort } = req.query;
  const { limit, offset } = getPagination(page, size);
  const sortType = getSort(sort, { Skills });
  try {
    const checkName = await Users.findOne({ where: { name: { [Op.iLike]: `%${search || null}%` } } });
    const condition = search ? !!checkName : null;
    const getUsers = await Users.findAndCountAll({
      include: [UserProfile, { model: Skills, where: condition === false ? { name: { [Op.iLike]: `%${search}%` } } : null }],
      where: condition ? { name: { [Op.iLike]: `%${search}%` }, type: "jobseeker" } : { type: "jobseeker" },
      limit,
      offset,
      order: sortType,
    });
    const results = getPagingData(getUsers, page, limit);
    res.json(results);
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
  findAllByRecuiter,
};
