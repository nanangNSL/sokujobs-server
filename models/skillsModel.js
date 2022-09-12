const { sequelizeJoi, Joi } = require("sequelize-joi");

const skills = (sequelize, Sequelize) => {
  sequelizeJoi(sequelize);

  const Skills = sequelize.define("skills", {
    name: { type: Sequelize.TEXT, allowNull: false, schema: Joi.string().trim() },
  });

  return Skills;
};

module.exports = skills;
