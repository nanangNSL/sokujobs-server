const { sequelizeJoi, Joi } = require("sequelize-joi");

const portfolio = (sequelize, Sequelize) => {
  sequelizeJoi(sequelize);

  const Portfolio = sequelize.define("portfolio", {
    name: { type: Sequelize.TEXT, allowNull: false, schema: Joi.string().trim().required() },
    linkRepo: { type: Sequelize.TEXT, allowNull: false, schema: Joi.string().trim().required() },
    type: {
      type: Sequelize.ENUM("mobile", "web"),
      defaultValue: "web",
      schema: Joi.string().trim().valid("mobile", "web").required(),
    },
    photo: { type: Sequelize.TEXT, defaultValue: null },
    photoName: { type: Sequelize.TEXT, defaultValue: null },
  });

  return Portfolio;
};

module.exports = portfolio;
