const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('dbms', 'root', 'root', {
  host: 'localhost',
  dialect: 'mysql'
});

sequelize
  .authenticate()
  .then(() => {
    console.log('DB Connected Successfully');
  })
  .catch((error) => {
    console.log('DB Connection Failed');
    console.error(error);
    process.exit(1);
  });

module.exports = sequelize;
