const { Users, Skills, UserSkills } = require("../models");

// Admin Privilages
const create = async (req, res, next) => {
  try {
    const results = await Skills.create(req.body);
    res.json(results);
  } catch (error) {
    next(error);
  }
};

const findAll = async (req, res, next) => {
  try {
    const results = await Skills.findAll();
    res.json(results);
  } catch (error) {
    next(error);
  }
};

const findById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const results = await Skills.findByPk(id);
    if (!results) throw new Error("Skill not found!", { cause: "NOT_FOUND" });
    res.json(results);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  const { id } = req.params;
  try {
    const results = await Skills.update(req.body, { where: { id }, returning: true });
    if (results[0] < 1) throw new Error(`Skill with id ${id} not found!`, { cause: "NOT_FOUND" });
    res.json(results[1][0]);
  } catch (error) {
    next(error);
  }
};

const deleteOne = async (req, res, next) => {
  const { id } = req.params;
  try {
    const results = await Skills.destroy({ where: { id } });
    if (results < 1) throw new Error(`Skill with id ${id} not found!`, { cause: "NOT_FOUND" });
    res.json({ message: "Skill deleted successfully", request: id });
  } catch (error) {
    next(error);
  }
};

// User Privilages
const createByUser = async (req, res, next) => {
  const { id } = req.decoded;
  const { name } = req.body;
  try {
    const checkUser = await Users.findByPk(id);
    if (!checkUser) throw new Error("User not found!", { cause: "NOT_FOUND" });
    const [result, _] = await Skills.findOrCreate({ where: { name } });
    await UserSkills.create({ userId: id, skillId: result.id });
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const findByUser = async (req, res, next) => {
  const { id } = req.decoded;
  try {
    const checkUser = await Users.findByPk(id);
    if (!checkUser) throw new Error("User not found!", { cause: "NOT_FOUND" });
    const results = await Skills.findAll({
      include: [{ model: Users, attributes: [], where: { id } }],
    });
    res.json(results);
  } catch (error) {
    next(error);
  }
};

const deleteByUser = async (req, res, next) => {
  const { id: userId } = req.decoded;
  const { id: skillId } = req.params;
  try {
    const checkUser = await Users.findByPk(userId);
    if (!checkUser) throw new Error("User not found!", { cause: "NOT_FOUND" });
    await UserSkills.destroy({ where: { userId, skillId } });
    res.json({ message: "Skill deleted successfully", request: skillId });
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
  deleteByUser,
};
