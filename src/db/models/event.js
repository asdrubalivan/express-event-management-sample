const isLongitudeValid = (val) => {
  if (Math.abs(val) >= 180) {
    throw new Error('Longitude is not valid');
  }
};

const isLatitudeValid = (val) => {
  if (Math.abs(val) >= 90) {
    throw new Error('Latitude is not valid');
  }
};

module.exports = (instance, Sequelize) => {
  const model = instance.define('event', {
    name: {
      type: Sequelize.STRING,
    },
    venue: {
      type: Sequelize.STRING,
    },
    begin_date: {
      type: Sequelize.DATE,
    },
    end_date: {
      type: Sequelize.DATE,
    },
    longitude: {
      type: Sequelize.DECIMAL(10, 7),
      validate: {
        isLongitudeValid,
      },
    },
    latitude: {
      type: Sequelize.DECIMAL(9, 7),
      validate: {
        isLatitudeValid,
      },
    },
  });
  return model;
};
