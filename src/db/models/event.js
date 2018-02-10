module.exports = (instance, Sequelize) => {
  const model = instance.define('event', {
    name: {
      type: Sequelize.STRING,
    },
    venue: {
      type: Sequelize.STRING,
    },
  });
  return model;
};
