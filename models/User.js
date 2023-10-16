const sequelize = require('./sequelize');
const { Sequelize, DataTypes } = require('sequelize');


const User = sequelize.define('User', {
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  accountType: {
    type: DataTypes.ENUM('Admin', 'Buyer', 'Seller'),
    allowNull: false,
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  approved: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  // token: {
  //   type: DataTypes.STRING,
  // },
  resetPasswordExpires: {
    type: DataTypes.DATE,
    defaultValue: null, // or a specific date
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  contactNumber: {
    type: DataTypes.INTEGER, // Use STRING for flexibility
    allowNull: false,
  }
 }, {
  // timestamps: true,
  // underscored: true,
  tableName: 'users',
});

(async () => {
  try {
    await sequelize.sync();
    console.log('Models synchronized with the database');
  } catch (error) {
    console.error('Error synchronizing models:', error);
  }
})();

module.exports = User;
