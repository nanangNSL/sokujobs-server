const { sequelizeJoi, Joi: joi } = require("sequelize-joi");
const Joi = joi.extend(require("joi-phone-number"));

const companyProfile = (sequelize, Sequelize) => {
  sequelizeJoi(sequelize);

  const CompanyProfile = sequelize.define("company_profile", {
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
    specialized: {
      type: Sequelize.TEXT,
      schema: Joi.string().trim(),
    },
    location: {
      type: Sequelize.TEXT,
      schema: Joi.string().trim(),
    },
    shortDesc: {
      type: Sequelize.TEXT,
      schema: Joi.string().trim(),
    },
    linkedin: {
      type: Sequelize.TEXT,
      schema: Joi.string().trim(),
    },
    instagram: {
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

  return CompanyProfile;
};

module.exports = companyProfile;
