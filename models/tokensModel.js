const { sequelizeJoi, Joi } = require("sequelize-joi");

const tokens = (sequelize, Sequelize) => {
  sequelizeJoi(sequelize);

  const Tokens = sequelize.define("tokens", {
    types: {
      type: Sequelize.ENUM("refreshToken", "resetPassword"),
      defaultValue: "refreshToken",
      schema: Joi.string().trim().valid("refreshToken", "resetPassword").required(),
    },
    token: {
      type: Sequelize.TEXT,
      allowNull: false,
      unique: true,
      schema: Joi.string().trim(),
    },
  });

  return Tokens;
};

module.exports = tokens;
