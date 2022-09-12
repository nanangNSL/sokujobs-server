const { sequelizeJoi, Joi: joi } = require("sequelize-joi");
const Joi = joi.extend(require("joi-phone-number"));

const userProfile = (sequelize, Sequelize) => {
  sequelizeJoi(sequelize);

  const UserProfile = sequelize.define("user_profile", {
    name: {
      type: Sequelize.TEXT,
      allowNull: false,
      schema: Joi.string().trim().required(),
    },
    email: {
      type: Sequelize.TEXT,
      allowNull: false,
      unique: true,
      schema: Joi.string().trim().email().required(),
    },
    phoneNumber: {
      type: Sequelize.TEXT,
      allowNull: false,
      unique: true,
      schema: Joi.string().trim().phoneNumber({ defaultCountry: "ID", format: "e164" }).required(),
    },
    type: {
      type: Sequelize.TEXT,
      schema: Joi.string().trim().required(),
    },
    domicile: {
      type: Sequelize.TEXT,
      schema: Joi.string().trim(),
    },
    position: {
      type: Sequelize.TEXT,
      schema: Joi.string().trim(),
    },
    companyName: {
      type: Sequelize.TEXT,
      schema: Joi.string().trim(),
    },
    shortDesc: {
      type: Sequelize.TEXT,
      schema: Joi.string().trim(),
    },
    instagram: {
      type: Sequelize.TEXT,
      schema: Joi.string().trim(),
    },
    linkedin: {
      type: Sequelize.TEXT,
      schema: Joi.string().trim(),
    },
    github: {
      type: Sequelize.TEXT,
      schema: Joi.string().trim(),
    },
    photo: {
      type: Sequelize.TEXT,
      defaultValue: null,
    },
    photoName: {
      type: Sequelize.TEXT,
      defaultValue: null,
    },
  });

  return UserProfile;
};

module.exports = userProfile;
