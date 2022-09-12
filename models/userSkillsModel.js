const userSkills = (sequelize, Sequelize) => {
  const UserSkills = sequelize.define("users_skills", {});

  return UserSkills;
};

module.exports = userSkills;
