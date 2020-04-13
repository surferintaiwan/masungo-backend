const bcrypt = require('bcryptjs')
const faker = require('faker')
'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [
      {
        name: 'root',
        isAdmin: true,
        email: 'root@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        gender: '1',
        birthday: '1990/2/3',
        phone: '0911111111',
        address: '台北市信義區信義路五段309號',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'user1',
        isAdmin: false,
        email: 'user1@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        gender: '1',
        birthday: '1992/7/9',
        phone: '0922222222',
        address: '台北市大同區五段300號',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'user2',
        isAdmin: false,
        email: 'user2@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        gender: '2',
        birthday: '1970/5/3',
        phone: '0933333333',
        address: '台北市信義區信義路五段1699號',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {})
  }
};
